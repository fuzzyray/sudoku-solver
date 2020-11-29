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

  app.route('/api/check')
    .post((req, res) => {
      console.log(req.body);
      res.json({error: 'not implemented'});
    });

  app.route('/api/solve')
    .post((req, res) => {
      if (!!req.body.puzzle) {
        const puzzleString = req.body.puzzle;
        if (solver.isValidPuzzleString(puzzleString)) {
          solver.setBoardFromString(puzzleString);
          const solution = solver.solve();
          const solutionErrorRegEx = /timeout|invalid/;
          res.json(solutionErrorRegEx.test(solution)
            ? {error: 'Puzzle cannot be solved'}
            : {solution: solution});
        } else {
          if (!solver.isValidLength(puzzleString)) {
            res.json({error: 'Expected puzzle to be 81 characters long'});
          } else if (!solver.isValidCharacters(puzzleString)) {
            res.json({error: 'Invalid characters in puzzle'});
          } else {
            res.json({error: 'Unknown error, this is a bug'});
          }
        }
      } else {
        res.json({error: 'Required field missing'});
      }
    });
};
