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

  squareIndex(i) {
    return (Math.floor(i / 27) * 3) + Math.floor((i % 27) / 3) % 3;
  };

  rowIndex(i) {
    return Math.floor((i % 27) / 9);
  };

  innerIndex(i) {
    return (i % 9) % 3;
  };

  setBoardFromString(puzzleString) {
    puzzleString.split('').forEach((d, i) => {
      this.sudokuBoard[this.squareIndex(i)]
        [this.rowIndex(i)]
        [this.innerIndex(i)] = d !== '.' ? +d : null;
    });
  };

  getStringFromBoard() {
    const result = [];

    for (let i = 0; i < 81; i++) {
      const value = this.sudokuBoard[this.squareIndex(i)]
        [this.rowIndex(i)][this.innerIndex(i)];
      result.push(!!value ? value : '.');
    }
    return result.join('');
  };

  getBoard() {
    return this.sudokuBoard;
  }

  getSquare(row, col) {
    const indexNum = (row * 9) + col;
    return this.sudokuBoard[this.squareIndex(indexNum)].flat();
  };

  getRow(row) {
    const result = [];
    const indexNum = row * 9;
    const indexRow = this.rowIndex(indexNum);
    const indexSquare = this.squareIndex(indexNum);
    for (let i = 0; i < 3; i++) {
      result.push(this.sudokuBoard[indexSquare + i][indexRow]);
    }
    return result.flat();
  };

  getColumn(col) {
    const result = [];
    for (let row = 0; row < 9; row++) {
      const indexNum = (row * 9) + col;
      result.push(
        this.sudokuBoard[this.squareIndex(indexNum)]
          [this.rowIndex(indexNum)]
          [this.innerIndex(indexNum)]);
    }
    return result;
  };

  validate(puzzleString) {
  }

  checkRowPlacement(puzzleString, row, column, value) {

  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {

  }

  toString() {
    return this.getStringFromBoard();
  }

}

module.exports = SudokuSolver;

