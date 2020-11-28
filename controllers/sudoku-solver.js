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
  values.delete(null);
  const validValues = symmetricDifference(values, completedSet);
  return validValues.has(value);
};

/*
 * The sudoku Board is a 3 dimensional array comprised of 9 matrices.
 * Each matrix represents a region of the sudoku board. Regions start
 * at the top left of the board.
 *
 * All indexing is 0 based
 */

class SudokuSolver {
  constructor(puzzleString) {
    this.sudokuBoard =
      [
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
        [[null, null, null], [null, null, null], [null, null, null]],
      ];

    if (!!puzzleString) {
      this.setBoardFromString(puzzleString);
    }
  }

  // The index functions take a value between 0 - 80 and return the index
  // for the appropriate object in the sudoku board array
  regionIndex(i) {
    return (Math.floor(i / 27) * 3) + Math.floor((i % 27) / 3) % 3;
  };

  regionRowIndex(i) {
    return Math.floor((i % 27) / 9);
  };

  regionRowElementIndex(i) {
    return (i % 9) % 3;
  };

  boardRowIndex(i) {
    return Math.floor(i / 9);
  }

  boardColumnIndex(i) {
    return i % 9;
  }

  // The get functions return a specific object from the board.
  // These are the entire board, a region, a column, or a row.
  getBoard() {
    return this.sudokuBoard;
  }

  getBoardRegion(row, column) {
    const indexNum = (row * 9) + column;
    return this.sudokuBoard[this.regionIndex(indexNum)].flat();
  };

  getBoardRow(row) {
    const result = [];
    const indexNum = row * 9;
    const indexRow = this.regionRowIndex(indexNum);
    const indexSquare = this.regionIndex(indexNum);
    for (let offset = 0; offset < 3; offset++) {
      result.push(this.sudokuBoard[indexSquare + offset][indexRow]);
    }
    return result.flat();
  };

  // Element operations, get, set, and remove
  getBoardColumn(column) {
    const result = [];
    for (let row = 0; row < 9; row++) {
      const index = (row * 9) + column;
      result.push(
        this.sudokuBoard[this.regionIndex(index)]
          [this.regionRowIndex(index)]
          [this.regionRowElementIndex(index)]);
    }
    return result;
  };

  getElement(row, column) {
    const index = (row * 9) + column;
    return this.sudokuBoard[this.regionIndex(index)]
      [this.regionRowIndex(index)]
      [this.regionRowElementIndex(index)];
  }

  setElement(row, column, value) {
    const index = (row * 9) + column;
    if (/[1-9]/.test(value) || value === null) {
      this.sudokuBoard[this.regionIndex(index)]
        [this.regionRowIndex(index)]
        [this.regionRowElementIndex(index)] = !!value ? +value : null;
    }
    return this.getElement(row, column);
  }

  removeElement(row, column) {
    const index = (row * 9) + column;
    this.sudokuBoard[this.regionIndex(index)]
      [this.regionRowIndex(index)]
      [this.regionRowElementIndex(index)] = null;
  }

  // Boolean logic functions to test validity of input and
  // placement on the board
  isValidPuzzleString(puzzleString) {
    return this.isValidLength(puzzleString) &&
      this.isValidCharacters(puzzleString);
  }

  isValidLength(puzzleString) {
    return (puzzleString.length === 81);
  }

  isValidCharacters(puzzleString) {
    const puzzleCharacterRegEx = /^[.1-9]+$/;
    return puzzleCharacterRegEx.test(puzzleString);
  }

  isValidRowPlacement(row, column, value) {
    if (this.getElement(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardRow(row), value);
    }
  }

  isValidColumnPlacement(row, column, value) {
    if (this.getElement(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardColumn(column), value);
    }
  }

  isValidRegionPlacement(row, column, value) {
    if (this.getElement(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardRegion(row, column), value);
    }
  }

  isValidBoard() {
    for (let i = 0; i < 81; i++) {
      const row = this.boardRowIndex(i);
      const column = this.boardColumnIndex(i);
      const elementValue = this.getElement(row, column);
      const validValues = this.getValidPossibleValues(row, column, true);
      if (elementValue && !validValues.has(elementValue)) {
        return false;
      }
    }
    return true;
  }

  isBoardSolved() {
    const diff = symmetricDifference(this.getBoard().flat(2), completedSet);
    return this.isValidBoard() && diff.size === 0;
  }

  // Get a set of the valid values for a specific element at a specified
  // row and column coordinate
  getValidPossibleValues(row, column, removeCurrentValue = false) {
    const elementValue = this.getElement(row, column);

    if (removeCurrentValue) {
      this.removeElement(row, column);
    } else if (!!elementValue) {
      return new Set([elementValue]);
    }

    const currentValues = [];
    currentValues.push(this.getBoardRegion(row, column));
    currentValues.push(this.getBoardRow(row));
    currentValues.push(this.getBoardColumn(column));
    const currentSet = new Set(currentValues.flat());
    currentSet.delete(null);
    const possibleValues = symmetricDifference(currentSet, completedSet);
    // Restore the previous value
    this.setElement(row, column, elementValue);
    return possibleValues;
  };

  // Solve the current board, return a string representing the solved board
  solve() {
    if (this.isBoardSolved()) {
      return this.getStringFromBoard();
    }

    if (!this.isValidBoard()) {
      return 'invalid board';
    }

    const attemptStack = [];
    let attemptCount = 0;

    while (!this.isBoardSolved()) {
      attemptCount++;
      let leastRowDiff = {row: null, size: 11, validValues: new Set()};
      for (let row = 0; row < 9; row++) {
        const rowDiff = symmetricDifference(completedSet,
          this.getBoardRow(row));
        if (!rowDiff.size) continue;
        if (rowDiff.size < leastRowDiff.size) {
          leastRowDiff.row = row;
          leastRowDiff.size = rowDiff.size;
          leastRowDiff.validValues = rowDiff;
        }
      }
      let leastValueDiff = {
        row: leastRowDiff.row,
        column: 0,
        size: 11,
        validValues: new Set(),
      };
      for (let column = 0; column < 9; column++) {
        let values = new Set();
        if (!this.getElement(leastRowDiff.row, column)) {
          values = this.getValidPossibleValues(leastRowDiff.row, column);
          if (values.size < leastValueDiff.size) {
            leastValueDiff.column = column;
            leastValueDiff.size = values.size;
            leastValueDiff.validValues = [...values];
          }
        }
      }
      let setValue;
      if (leastValueDiff.validValues.length > 0) {
        setValue = leastValueDiff.validValues.pop();
        this.setElement(leastValueDiff.row, leastValueDiff.column, setValue);
        attemptStack.push({
          string: this.getStringFromBoard(),
          row: leastValueDiff.row,
          column: leastValueDiff.column,
          setValue: setValue,
          values: leastValueDiff.validValues,
        });
      } else {
        let attempt;
        while (attemptStack.length > 0) {
          attempt = attemptStack.pop();
          if (attempt.values.length > 0) break;
        }
        this.setBoardFromString(attempt.string);
        attempt.setValue = attempt.values.pop();
        this.setElement(attempt.row, attempt.column, attempt.setValue);
        attemptStack.push(attempt);
      }
      if (attemptCount === 100000) return 'taking too long to solve';

      console.log('Count:', attemptCount, 'Stack:', attemptStack.length,
        this + '');
    }
    return this.getStringFromBoard();
  }

  // Set the board from a string and get a string from the board
  setBoardFromString(puzzleString) {
    if (this.isValidPuzzleString(puzzleString)) {
      puzzleString.split('').forEach((d, i) => {
        this.sudokuBoard[this.regionIndex(i)]
          [this.regionRowIndex(i)]
          [this.regionRowElementIndex(i)] = d !== '.' ? +d : null;
      });
    }
  };

  getStringFromBoard() {
    const result = [];
    for (let index = 0; index < 81; index++) {
      const value = this.sudokuBoard[this.regionIndex(index)]
        [this.regionRowIndex(index)]
        [this.regionRowElementIndex(index)];
      result.push(!!value ? value : '.');
    }
    return result.join('');
  };

  toString() {
    return this.getStringFromBoard();
  }
}

module.exports = SudokuSolver;

