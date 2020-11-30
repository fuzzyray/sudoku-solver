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
 *
 * Solving Algorithm is:
 * find a cell with the least amount of valid values.
 * If the cell has no valid values, backtrack to the previous move with at
 * least one valid value and continue.
 * If there are no previous moves with valid values, the puzzle layout is
 * unsolvable.
 * If there is a valid value, set the cell to a valid value.
 * repeat until the puzzle is either solved, or unsolvable.
 *
 * The deterministic flag determines if we use .pop() to get the current cell
 * and value or if we randomly pick a cell and value
 *
 * The verbose flag logs the state of the solving process
 */

class SudokuSolver {
  constructor(puzzleString = null, deterministic = false, verbose = false) {
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
    this.deterministic = deterministic;
    this.verbose = verbose;
  }

  // The index functions take a value between 0 - 80 and return the index
  // for the appropriate object in the sudoku board array
  regionIndex(i) {
    return (Math.floor(i / 27) * 3) + Math.floor((i % 27) / 3) % 3;
  };

  regionRowIndex(i) {
    return Math.floor((i % 27) / 9);
  };

  regionRowCellIndex(i) {
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

  // Cell operations, get, set, and remove
  getBoardColumn(column) {
    const result = [];
    for (let row = 0; row < 9; row++) {
      const index = (row * 9) + column;
      result.push(
        this.sudokuBoard[this.regionIndex(index)]
          [this.regionRowIndex(index)]
          [this.regionRowCellIndex(index)]);
    }
    return result;
  };

  getCell(row, column) {
    const index = (row * 9) + column;
    return this.sudokuBoard[this.regionIndex(index)]
      [this.regionRowIndex(index)]
      [this.regionRowCellIndex(index)];
  }

  setCell(row, column, value) {
    const index = (row * 9) + column;
    if (/[1-9]/.test(value) || value === null) {
      this.sudokuBoard[this.regionIndex(index)]
        [this.regionRowIndex(index)]
        [this.regionRowCellIndex(index)] = !!value ? +value : null;
    }
    return this.getCell(row, column);
  }

  removeCell(row, column) {
    const index = (row * 9) + column;
    this.sudokuBoard[this.regionIndex(index)]
      [this.regionRowIndex(index)]
      [this.regionRowCellIndex(index)] = null;
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
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardRow(row), value);
    }
  }

  isValidColumnPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardColumn(column), value);
    }
  }

  isValidRegionPlacement(row, column, value) {
    if (this.getCell(row, column)) {
      return false;
    } else {
      return isValidValue(this.getBoardRegion(row, column), value);
    }
  }

  isValidBoard() {
    for (let i = 0; i < 81; i++) {
      const row = this.boardRowIndex(i);
      const column = this.boardColumnIndex(i);
      const cellValue = this.getCell(row, column);
      const validValues = this.getValidPossibleValues(row, column, true);
      if (cellValue && !validValues.has(cellValue)) {
        return false;
      }
    }
    return true;
  }

  isBoardSolved() {
    const diff = symmetricDifference(this.getBoard().flat(2), completedSet);
    return this.isValidBoard() && diff.size === 0;
  }

  // Get a set of the valid values for a specific cell at a specified
  // row and column coordinate
  getValidPossibleValues(row, column, removeCurrentValue = false) {
    const cellValue = this.getCell(row, column);

    if (removeCurrentValue) {
      this.removeCell(row, column);
    } else if (!!cellValue) {
      return new Set([cellValue]);
    }

    const currentValues = [];
    currentValues.push(this.getBoardRegion(row, column));
    currentValues.push(this.getBoardRow(row));
    currentValues.push(this.getBoardColumn(column));
    const currentSet = new Set(currentValues.flat());
    currentSet.delete(null);
    const possibleValues = symmetricDifference(currentSet, completedSet);
    // Restore the previous value
    this.setCell(row, column, cellValue);
    return possibleValues;
  };

  // Solve the current board, return a string representing the solved board
  solve() {

    // Verify that the initial state is a valid board
    if (!this.isValidBoard()) {
      return 'invalid board';
    }

    // Keep a stack of our attempts to solve, so we can backtrack as necessary
    const attemptStack = [];
    let attemptCount = 0;

    while (!this.isBoardSolved()) {
      attemptCount++;

      // find the cells with the least number of possible values
      // maximum number of valid values is 9
      let cells = [];
      let numberOfValidValues = 9;
      let currentValidValues = new Set();
      for (let index = 0; index < 81; index += 1) {
        const row = this.boardRowIndex(index);
        const column = this.boardColumnIndex(index);
        const cellValue = this.getCell(row, column);
        if (!!cellValue) continue;
        currentValidValues = this.getValidPossibleValues(row, column);
        if (currentValidValues.size <= numberOfValidValues) {
          numberOfValidValues = currentValidValues.size;
          cells = cells.filter(e => {
            return e.values.length === numberOfValidValues;
          });
          cells.push({
            row: row,
            column: column,
            values: [...currentValidValues],
          });
        }
      }

      // Set the cell to a valid cell
      let cell;
      if (this.deterministic) {
        cell = cells.pop();
      } else {
        cell = cells[Math.floor(Math.random() * cells.length)];
      }

      // if we have no valid values, backtrack
      if (cell.values.length === 0 && attemptStack.length > 0) {
        while (attemptStack.length > 0) {
          cell = attemptStack.pop();
          if (cell.values.length > 0) break;
        }
        this.setBoardFromString(cell.string);
      }

      // If we have no valid values and stack is empty, puzzle is unsolvable
      if (cell.values.length === 0 && attemptStack.length === 0) {
        if (this.verbose) console.log(cell);
        return 'Unsolvable puzzle layout';
      }

      let valueIndex;
      if (this.deterministic) {
        cell.setValue = cell.values.pop();
      } else {
        valueIndex = Math.floor(Math.random() * cell.values.length);
        cell.setValue = cell.values[valueIndex];
        cell.values.splice(valueIndex, 1);
      }
      this.setCell(cell.row, cell.column, cell.setValue);
      cell.string = this.getStringFromBoard();
      attemptStack.push(cell);

      if (attemptCount === 5000) {
        if (this.verbose) console.log(attemptStack);
        return 'timeout attempting to solve';
      }
      if (this.verbose) {
        console.log('Count:', attemptCount, 'Stack:', attemptStack.length,
          this + '');
      }
    }
    return this.getStringFromBoard();
  }

  // Set the board from a string and get a string from the board
  setBoardFromString(puzzleString) {
    if (this.isValidPuzzleString(puzzleString)) {
      puzzleString.split('').forEach((d, i) => {
        this.sudokuBoard[this.regionIndex(i)]
          [this.regionRowIndex(i)]
          [this.regionRowCellIndex(i)] = d !== '.' ? +d : null;
      });
    }
  };

  getStringFromBoard() {
    const result = [];
    for (let index = 0; index < 81; index++) {
      const value = this.sudokuBoard[this.regionIndex(index)]
        [this.regionRowIndex(index)]
        [this.regionRowCellIndex(index)];
      result.push(!!value ? value : '.');
    }
    return result.join('');
  };

  toString() {
    return this.getStringFromBoard();
  }
}

module.exports = SudokuSolver;

