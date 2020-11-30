/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('POST to /api/solve', () => {
    test('Solvable puzzle posted returns completed puzzle', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const output = '769235418851496372432178956174569283395842761628713549283657194516924837947381625';
      assert.fail('Test not implemented');
      done();
    });

    test('Puzzle Field Missing', done => {
      const error = {error: 'Required field missing'};
      assert.fail('Test not implemented');
      done();
    });

    test('Invalid Characters in Puzzle', done => {
      const error = {error: 'Invalid characters in puzzle'};
      assert.fail('Test not implemented');
      done();
    });

    test('Puzzle incorrect length', done => {
      const error = {error: 'Expected puzzle to be 81 characters long'};
      assert.fail('Test not implemented');
      done();
    });

    test('Puzzle Cannot be Solved', done => {
      const input = '779235418851496372432178956174569283395842761628713549283657194516924837947381625';
      const error = {error: 'Puzzle cannot be solved'};
      assert.fail('Test not implemented');
      done();
    });
  });

  suite('POST to /api/check', () => {

    test('All fields filled in correctly, valid placement', done => {
      const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
      const coordinate = 'A1';
      const value = '7';
      const status = {valid: true};
      assert.fail('Test not implemented');
      done();
    });

    test('All fields filled in correctly, invalid placement, single conflict',
      done => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A2';
        const value = '1';
        const status = {valid: false, conflict: ['row']};
        assert.fail('Test not implemented');
        done();
      });

    test(
      'All fields filled in correctly, invalid placement, multiple conflicts',
      done => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '1';
        const status = {valid: false, conflict: ['row', 'column']};
        assert.fail('Test not implemented');
        done();
      });

    test('All fields filled in correctly, invalid placement, all conflicts',
      done => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        const coordinate = 'A1';
        const value = '5';
        const status = {valid: false, conflict: ['row', 'column', 'region']};
        assert.fail('Test not implemented');
        done();
      });

    test('Required Field(s) Missing', done => {
      const error = {error: 'Required field(s) missing'};
      assert.fail('Test not implemented');
      done();
    });

    test('Invalid Characters in Puzzle', done => {
      const error = {error: 'Invalid characters in puzzle'};
      assert.fail('Test not implemented');
      done();
    });

    test('Puzzle incorrect length', done => {
      const error = {error: 'Expected puzzle to be 81 characters long'};
      assert.fail('Test not implemented');
      done();
    });

    test('Coordinate Out of Bounds', done => {
      const coordinate1 = 'K1';
      const coordinate2 = 'A11';
      const error = {error: 'Invalid coordinate'};
      assert.fail('Test not implemented');
      done();
    });

    test('Invalid Value', done => {
      const error = {error: 'Invalid value'};
      assert.fail('Test not implemented');
      done();
    });

  });
});

