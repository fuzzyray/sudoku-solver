/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  const solver = new SudokuSolver();

  // Take a coordinate string in the form [A-I][1-9] (i.e 'A1') and return an
  // array with the zero based row and column coordinates used by the
  // SudokuSolver class
  // returns: [row, col]
  const convertCoordinate = (coordinate) => {
    const result = coordinate.split('').reverse();
    result[0] = +result[0] - 1;
    result[1] = result[1].codePointAt(0) - 'A'.codePointAt(0);
    return result;
  };

  const getPuzzleStringError = (puzzleString) => {
    if (!solver.isValidPuzzleString(puzzleString)) {
      if (!solver.isValidLength(puzzleString)) {
        return {error: 'Expected puzzle to be 81 characters long'};
      } else if (!solver.isValidCharacters(puzzleString)) {
        return {error: 'Invalid characters in puzzle'};
      } else {
        return {error: 'Unknown error, this is a bug'};
      }
    } else {
      return {error: 'Valid puzzle passed to getPuzzleStringError function, this is a bug'};
    }
  };

  app.route('/api/check')
    .post((req, res) => {
      const {puzzle = null, coordinate = null, value = null} = req.body;
      if (!puzzle || !coordinate || !value) {
        res.json({error: 'Required field(s) missing'});
      } else if (!/[A-I][1-9]/.test(coordinate)) {
        res.json({error: 'Invalid coordinate'});
      } else if (!/[1-9]/.test(value)) {
        res.json({error: 'Invalid value'});
      } else if (!solver.isValidPuzzleString(puzzle)) {
        res.json(getPuzzleStringError(puzzle));
      } else {
        solver.setBoardFromString(puzzle);
        const [row, column] = convertCoordinate(coordinate);
        const conflicts = [];
        // TODO: What do we do if coordinate has an existing value?
        // Current behavior is return a conflict regardless of passed
        // value. Do we return invalid coordinate or just remove the existing
        // value and check?
        if (!solver.isValidRegionPlacement(row, column, +value)) {
          conflicts.push('region');
        }
        if (!solver.isValidColumnPlacement(row, column, +value)) {
          conflicts.push('column');
        }
        if (!solver.isValidRowPlacement(row, column, +value)) {
          conflicts.push('row');
        }
        if (!conflicts.length) {
          res.json({valid: true});
        } else {
          res.json({valid: false, conflicts: conflicts});
        }
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      if (!!req.body.puzzle) {
        const puzzle = req.body.puzzle;
        if (solver.isValidPuzzleString(puzzle)) {
          solver.setBoardFromString(puzzle);
          const solution = solver.solve();
          const solutionErrorRegEx = /timeout|invalid|Unsolvable/;
          res.json(solutionErrorRegEx.test(solution)
            ? {error: 'Puzzle cannot be solved'}
            : {solution: solution});
        } else {
          res.json(getPuzzleStringError(puzzle));
        }
      } else {
        res.json({error: 'Required field missing'});
      }
    });
};
