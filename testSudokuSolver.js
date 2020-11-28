const SudokuSolver = require('./controllers/sudoku-solver.js');

const puzzleString = '135762984946381257728459613694517832812936745357824196473298561581673429269145378';
//const puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';

const newPuzzle = new SudokuSolver()
newPuzzle.setBoardFromString(puzzleString)
console.table(newPuzzle.getBoard());
console.table(newPuzzle.getSquare(4, 4));
console.table(newPuzzle.getRow(4));
console.table(newPuzzle.getColumn(4));
console.log(newPuzzle + "")
