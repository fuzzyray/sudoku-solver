const completedSet = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
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

    for (let i = 0; i < 81; i++) {
      const value = this.sudokuBoard[this.regionIndex(i)]
        [this.regionRowIndex(i)][this.regionRowElementIndex(i)];
      result.push(!!value ? value : '.');
    }
    return result.join('');
  };

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
    for (let i = 0; i < 3; i++) {
      result.push(this.sudokuBoard[indexSquare + i][indexRow]);
    }
    return result.flat();
  };

  getBoardColumn(column) {
    const result = [];
    for (let row = 0; row < 9; row++) {
      const indexNum = (row * 9) + column;
      result.push(
        this.sudokuBoard[this.regionIndex(indexNum)]
          [this.regionRowIndex(indexNum)]
          [this.regionRowElementIndex(indexNum)]);
    }
    return result;
  };

  getElement(row, column) {
    const indexNum = (row * 9) + column;
    return this.sudokuBoard[this.regionIndex(indexNum)]
      [this.regionRowIndex(indexNum)]
      [this.regionRowElementIndex(indexNum)];
  }

  setElement(row, column, value) {
    const indexNum = (row * 9) + column;
    if (/[1-9]/.test(value) || value === null) {
      this.sudokuBoard[this.regionIndex(indexNum)]
        [this.regionRowIndex(indexNum)]
        [this.regionRowElementIndex(indexNum)] = !!value ? +value : null;
    }
    return this.getElement(row, column);
  }

  removeElement(row, column) {
    const indexNum = (row * 9) + column;
    this.sudokuBoard[this.regionIndex(indexNum)]
      [this.regionRowIndex(indexNum)]
      [this.regionRowElementIndex(indexNum)] = null;
  }

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

  getValidPossibleValues(row, column, removeValue = false) {
    const elementValue = this.getElement(row, column);

    if (removeValue) {
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
      //console.log(leastRowDiff);
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
      //console.log(leastValueDiff);
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
        //console.log('backtrack to attempt:', attempt);
        this.setBoardFromString(attempt.string);
        attempt.setValue = attempt.values.pop();
        this.setElement(attempt.row, attempt.column, attempt.setValue);
        attemptStack.push(attempt);
      }
      console.log('Count:', attemptCount, 'Stack:', attemptStack.length,
        this + '');
      if (attemptCount === 100000) return 'taking too long to solve';
    }
    return this.getStringFromBoard();
  }

  toString() {
    return this.getStringFromBoard();
  }

}

module.exports = SudokuSolver;

