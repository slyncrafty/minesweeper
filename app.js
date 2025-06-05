// Make sure HTML elements are all loaded before we read this js file
// Equally effect if putting js script tag at the end of html file.
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagHint = document.getElementById('hint');
    const resetBtn = document.getElementById('reset');
    resetBtn.addEventListener('click', resetGame);
    let width = 10;
    let bombCount = 15;
    let flagCount = 0;
    let cells = [];
    let isGameOver = false;

    startGame();





    // random shuffle function Fisher-Yates Shuffle
    function shuffle(array) {
        let currentIndex = array.length;
        while(currentIndex !== 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // create Board
    function createBoard() {
        // get shuffled game array with random bombs
        const bombsArray = Array(bombCount).fill('bomb');
        const emptyArray = Array(width * width - bombCount).fill('valid');
        const gamesArray = emptyArray.concat(bombsArray);  // Join the two arrays
        const shuffledArray = shuffle(gamesArray);

        // Iteratively create cells and push them into cells
        for(let i = 0; i < width*width; i++) {
            const cell = document.createElement('div');
            cell.setAttribute('id', i);
            cell.classList.add(shuffledArray[i]);  // Add class of bomb or valid
            grid.appendChild(cell);
            cells.push(cell);

            // normal click
            cell.addEventListener('click', function(e) {
                click(cell);
            })

            // ctrl + left click to add Flag to a cell
            cell.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(cell);
            }
        }

        // add numbers to display
        for (let i = 0; i < cells.length; i++) {
            let total = 0;

            // edge cells
            const isLeftEdge = ( i % width === 0 );
            const isRightEdge = ( i % width === width - 1 );

            /* 
            ** NW N NE    |   (i-1-width)  (i-width)  (i+1-width)
            ** W  i  E    |   (i-1)            i            (i+1)
            ** SW S SE    |   (i-1+width)  (i+width)  (i+1+width)
            */ 

            if(cells[i].classList.contains('valid')) {
                // Check cells on the W -- excluding leftEdges and check cell on the left
                if( i > 0 && !isLeftEdge && cells[i - 1].classList.contains('bomb')) total++;
                // Check cells on the NE except first row & excluding rightEdges 
                if( i > 9 && !isRightEdge && cells[i + 1 - width].classList.contains('bomb')) total++;
                // Check cells on the N 
                if( i > 10 && cells[i - width].classList.contains('bomb')) total++;
                // Check cells on the NW 
                if( i > 11 && !isLeftEdge && cells[i - 1 - width].classList.contains('bomb')) total++;
                // Check cells on the E
                if( i < 98 && !isRightEdge && cells[i + 1].classList.contains('bomb')) total++;
                // Check cells on the SW
                if( i < 90 && !isLeftEdge && cells[i - 1 + width].classList.contains('bomb')) total++;
                // Check cells on the SE
                if( i < 89 && !isRightEdge && cells[i +1 + width].classList.contains('bomb')) total++;
                // Check cells on the S
                if( i < 89 && cells[i + width].classList.contains('bomb')) total++;
                
                // total indicates the number of bomb surrounding the cell
                cells[i].setAttribute('data', total); 
            }
        }
        flagHint.textContent = bombCount - flagCount;
    }


    function startGame() {
        createBoard();
    }

    function resetGame() {
        grid.replaceChildren();     // remove all div cells
        cells = [];
        flagCount = 0;
        isGameOver = false;
        resetBtn.textContent ='🙂';
        createBoard();
    }


    // add Flag with right click
    function addFlag(cell) {
        if(isGameOver) return;
        if(!cell.classList.contains('checked') && (flagCount <= bombCount)) {
            if(!cell.classList.contains('flag')) {
                cell.classList.add('flag');
                cell.textContent = '🚩';
                flagCount++;
                flagHint.textContent = bombCount - flagCount;
                checkForWin(cell);
            } else {
                cell.classList.remove('flag');
                cell.textContent = '';
                flagCount--;
                flagHint.textContent = bombCount - flagCount;
            }
        }
    }

    // Handle click on cell actions
    // normal click shows number of bomb counts around the cell
    // or if it is bomb, then game over
    // if click on an empty(total === 0) cell, it fans out.
    function click(cell) {
        let currentCellId = parseInt(cell.id);
        if(isGameOver) return; // if game is over click doesn't do anything
        if(cell.classList.contains('checked') || cell.classList.contains('flag')) return;
        if(cell.classList.contains('bomb')) {
            gameOver(cell);
        } else {
            let total = cell.getAttribute('data');
            if(total != 0) {
                cell.classList.add('checked');
                cell.textContent = total;
                return;
            }
            checkCell(cell, currentCellId);
        }
        cell.classList.add('checked');
    }

    // Check neighboring cells when clicked.
    function checkCell(cell, currentCellId) {
        const isLeftEdge = (currentCellId % width === 0);
        const isRightEdge = (currentCellId % width === width - 1);
        // Allowing time for recursion
        setTimeout((cell) => {
            // recursively check the next neighbors(8) and reveal(click) them
            // Check cells on the W
            if(currentCellId > 0 && !isLeftEdge) {
                const nextCellId = currentCellId - 1;
                getNextCell(nextCellId);
            }
            // Check cells on the NE
            if(currentCellId > 9 && !isRightEdge) {
                const nextCellId = currentCellId + 1 - width;
                getNextCell(nextCellId);
            }
            // Check cells on the N 
            if( currentCellId > 10) {
                const nextCellId = currentCellId - width;
                getNextCell(nextCellId);
            }
            // Check cells on the NW 
            if( currentCellId > 11 && !isLeftEdge) {
                const nextCellId = currentCellId - width - 1;
                getNextCell(nextCellId);
            }
            // Check cells on the E
            if( currentCellId < 98 && !isRightEdge) {
                const nextCellId = currentCellId + 1;
                getNextCell(nextCellId);
            }
            // Check cells on the SW
            if( currentCellId < 90 && !isLeftEdge) {
                const nextCellId = currentCellId + width - 1;
                getNextCell(nextCellId);
            }
            // Check cells on the SE
            if( currentCellId < 89 && !isRightEdge) {
                const nextCellId = currentCellId + width + 1;
                getNextCell(nextCellId);
            }
            // Check cells on the S
            if( currentCellId < 89) {
                const nextCellId = currentCellId + width;
                getNextCell(nextCellId);
            }

        }, 10)
    }

    // Helper function
    function getNextCell(nextCellId) {
        const nextCell = document.getElementById(nextCellId);
        // console.log('yay')   // debugging
        click(nextCell);
    }

    // Game over 
    function gameOver(cell) {
        // console.log('😵 Game Over! 💣');    
        resetBtn.textContent = '😵';
        isGameOver = true;

        // reveal all bomb locations
        cells.forEach(cell => {
            if (cell.classList.contains('bomb')) {
                cell.textContent = '💣'
            }
        })
    }

    // check for win
    function checkForWin() {
        let matches = 0;
        for(let i = 0; i < cells.length; i++) {
            if(cells[i].classList.contains('flag') && cells[i].classList.contains('bomb')) {
                matches++;
            }
            if(matches === bombCount) {
                // console.log('You won!');
                resetBtn.textContent = '😎';
                isGameOver = true;
            }
        }
    }



})

