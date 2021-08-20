/*
 SudokuSolver Class for solving a sudoku puzzle. Input is an 81 character
 string representing the initial state of the board.

 Valid characters are 1-9 and period for no value.

 Example:
 '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
 */

// Utility set operations for finding values
const completedSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

// symmetricDifference function copied from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
const symmetricDifference = (setA, setB) => {
  let _difference = new Set(setA);
  for (let elem of setB) {
    if (_difference.has(elem)) {
      _difference.delete(elem);
    } else {
      _difference.add(elem);
    }
  }
  return _difference;
};

const isValidValue = (valueSet, value) => {
  const values = new Set(valueSet);
  values.delete(0);
  const validValues = symmetricDifference(values, completedSet);
  return validValues.has(value);
};

/*
 * The sudoku Board is a 2 dimensional array comprised of 9 rows with 9 columns
 *
 * All indexing is 0 based
 *
 * Solving Algorithm is a heuristic, recursive brute force algorithm
 *
 * The deterministic flag is left for backwards compatibility with the original algorithm
 * It is unused in this solver.
 *
 * The verbose flag is unused but left for backwards compatibility
 */

class SudokuSolver {
  constructor(puzzleString = null, deterministic = false, verbose = false) {
    this.sudokuBoard =
      [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];
    if (!!puzzleString) {
      this.setBoardFromString(puzzleString);
    }
  }

  // setBoardFromString initializes the sudokuBoard with the given puzzle
  setBoardFromString(puzzleString) {
    if (this.isValidPuzzleString(puzzleString)) {
      puzzleString.split('').forEach((d, i) => {
        const row = Math.floor(i / 9);
        const col = i % 9;
        this.sudokuBoard[row][col] = d !== '.' ? +d : 0;
      });
    }
  }

  // getStringFromBoard returns a string representing the current state of the sudokuBoard
  getStringFromBoard() {
    const result = [];
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const value = this.sudokuBoard[row][column];
        result.push(!!value ? value : '.');
      }
    }
    return result.join('');
  }

  toString() {
    return this.getStringFromBoard();
  }

  getCell(row, column) {
    return this.sudokuBoard[row][column];
  }

  setCell(row, column, value) {
    if (/[0-9]/.test(value)) {
      this.sudokuBoard[row][column] = +value;
    }
    return this.getCell(row, column);
  }

  removeCell(row, column) {
    this.sudokuBoard[row][column] = 0;
  }

  // getRow returns the corresponding row in the sudokuboard
  getRow(row) {
    return this.sudokuBoard[row];
  }

  // getColumn returns the corresponding column in the sudokuboard
  getColumn(column) {
    const result = [];
    for (let i = 0; i < 9; i++) {
      result.push(this.sudokuBoard[i][column]);
    }
    return result;
  }

  // getRegion returns the corresponding region in the sudokuboard identified by the row and column
  getRegion(row, column) {
    const result = [];
    const startRow = Math.floor(row / 3) * 3;
    const startColumn = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        result.push(this.sudokuBoard[startRow + i][startColumn + j]);
      }
    }
    return result;
  }

  getValidPossibleValues(row, column, removeCurrentValue = false) {
    const cellValue = this.getCell(row, column);

    if (removeCurrentValue) {
      this.removeCell(row, column);
    } else if (!!cellValue) {
      return new Set([cellValue]);
    }

    const currentValues = [];
    currentValues.push(this.getRegion(row, column));
    currentValues.push(this.getRow(row));
    currentValues.push(this.getColumn(column));
    const currentSet = new Set(currentValues.flat());
    currentSet.delete(0);
    const possibleValues = symmetricDifference(currentSet, completedSet);
    // Restore the previous value
    this.setCell(row, column, cellValue);
    return possibleValues;
  };

  // isValidPuzzleString returns true if the string is a valid sudoku layout
  isValidPuzzleString(puzzleString) {
    return this.isValidLength(puzzleString) &&
      this.isValidCharacters(puzzleString);
  }

  // isValidLength returns true if the string is 81 characters
  isValidLength(puzzleString) {
    return (puzzleString.length === 81);
  }

  // isValidCharacters returns true if the string only contains characters '1' - '9' and '.'
  isValidCharacters(puzzleString) {
    const puzzleCharacterRegEx = /^[.1-9]+$/;
    return puzzleCharacterRegEx.test(puzzleString);
  }

  // isValidRowPlacement returns true if a value is a valid value for a row
  isValidRowPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getRow(row), value);
    }
  }

  // isValidColumnPlacement returns true if a value is a valid value for a column
  isValidColumnPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getColumn(column), value);
    }
  }

  // isValidRegionPlacement returns true if a value is a valid value for a region
  isValidRegionPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getRegion(row, column), value);
    }
  }

  // isValidBoard returns true if the board satisfies sudoku constraints
  isValidBoard() {
    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        const cellValue = this.getCell(row, column);
        const validValues = this.getValidPossibleValues(row, column, true);
        if (cellValue && !validValues.has(cellValue)) {
          return false;
        }
      }
    }
    return true;
  }

  isBoardSolved() {
    const diff = symmetricDifference(this.sudokuBoard.flat(), completedSet);
    return this.isValidBoard() && diff.size === 0;
  }

// Solve the current board, return a string representing the solved board
  solve() {
    const getCellWithLeastValidValues = () => {
      const result = {
        'row': 9,
        'column': 9,
        'values': [],
      };
      let minCount = 9;

      for (let row = 0; row < 9; row++) {
        for (let column = 0; column < 9; column++) {
          if (this.getCell(row, column) === 0) {
            const values = this.getValidPossibleValues(row, column);
            if (values.size < minCount) {
              minCount = values.size;
              result['row'] = row;
              result['column'] = column;
              result['values'] = [...values];
            }
          }
        }
      }
      return result;
    };

    const heuristic_solver = (depth = 1) => {
      if (this.isBoardSolved()) {
        return true;
      }
      const cell = getCellWithLeastValidValues();
      for (let i = 0; i < cell.values.length; i++) {
        this.setCell(cell.row, cell.column, cell.values[i]);
        if (heuristic_solver(depth + 1)) {
          return true;
        }
        this.removeCell(cell.row, cell.column);
      }
      return false;
    };

    // Verify that the initial state is a valid board
    if (!this.isValidBoard()) {
      return 'invalid board';
    }
    if (heuristic_solver()) {
      return this.getStringFromBoard();
    } else {
      return 'Unsolvable puzzle layout';
    }
  }
}

module.exports = SudokuSolver;