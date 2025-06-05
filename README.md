# Mindsweeper 💣💣

Simplified Mindsweeper game functionality using vanilla Javascript.

**Link to project:** http://recruiters-love-seeing-live-demos.com/

![alt tag](http://placecorgi.com/1200/650)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript
Main grid consists of 10x10 cells each uniquely indexed. Out of the cells, bombCount number of bombs are randomly shuffled with regular cells.
Recursion and inbuilt methods were used to handle recursively checking the neighboring cells when the initially clicked cell has neighbor bomb count 0 and reveal all safe cells. Left mouse button `click` is handled with checking each neighboring cells and returning the total number of bombs around the cell. `ctrl` + `click` action creates flags and each flag placing calls a function that compares bomb locations and flag locations to determine the game won or lost.

## Lessons Learned:

setTimeout() was a key factor in smooth running of the recursive checking. It allowed time for the checking to be finished.

## Examples:

Take a look at these couple examples that I have in my portfolio:

**Pomodoro Timer:** https://github.com/slyncrafty/pomodoro-timer

**Portfolio:** https://slyncrafty.github.io/
