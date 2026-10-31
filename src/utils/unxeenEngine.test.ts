import test from 'node:test';
import assert from 'node:assert/strict';
import {
  lookupUnxeenFormula,
  predictNextUnxeen,
  evaluatePrediction,
  selectDualPredictedNumbers,
  DrawRecord,
} from './unxeenEngine';

test('Unxeen formula: User explicit case (S=1, B=4, Top=9) -> BIG', () => {
  const result = lookupUnxeenFormula(1, 9);
  assert.equal(result, 'BIG');
});

test('Unxeen formula: Spot-checks from notebook master table', () => {
  // Top 0
  assert.equal(lookupUnxeenFormula(1, 0), 'SMALL'); // S-1/B-4]0 = Small
  assert.equal(lookupUnxeenFormula(3, 0), 'BIG');   // S-3/B-2]0 = Big
  assert.equal(lookupUnxeenFormula(0, 0), 'BIG');   // S-0/B-5]0 = Big
  assert.equal(lookupUnxeenFormula(5, 0), 'SMALL'); // S-5/B-0]0 = Small

  // Top 1 (Inverted per user request: Big -> Small, Small -> Big)
  assert.equal(lookupUnxeenFormula(1, 1), 'BIG');
  assert.equal(lookupUnxeenFormula(2, 1), 'SMALL');
  assert.equal(lookupUnxeenFormula(5, 1), 'BIG');

  // Top 2 (Unchanged)
  assert.equal(lookupUnxeenFormula(1, 2), 'BIG');
  assert.equal(lookupUnxeenFormula(2, 2), 'SMALL');
  assert.equal(lookupUnxeenFormula(4, 2), 'BIG');

  // Top 3 (Inverted per user request: Big -> Small, Small -> Big)
  assert.equal(lookupUnxeenFormula(1, 3), 'SMALL');
  assert.equal(lookupUnxeenFormula(2, 3), 'BIG');
  assert.equal(lookupUnxeenFormula(5, 3), 'SMALL');

  // Top 5 (Inverted per user request: Big -> Small, Small -> Big)
  assert.equal(lookupUnxeenFormula(1, 5), 'BIG');
  assert.equal(lookupUnxeenFormula(2, 5), 'BIG');
  assert.equal(lookupUnxeenFormula(3, 5), 'SMALL');
  assert.equal(lookupUnxeenFormula(4, 5), 'SMALL');

  // Top 6
  assert.equal(lookupUnxeenFormula(1, 6), 'BIG');
  assert.equal(lookupUnxeenFormula(2, 6), 'BIG');
  assert.equal(lookupUnxeenFormula(3, 6), 'SMALL');

  // Top 7
  assert.equal(lookupUnxeenFormula(1, 7), 'SMALL');
  assert.equal(lookupUnxeenFormula(3, 7), 'BIG');

  // Top 8
  assert.equal(lookupUnxeenFormula(1, 8), 'SMALL');
  assert.equal(lookupUnxeenFormula(3, 8), 'BIG');
  assert.equal(lookupUnxeenFormula(4, 8), 'SMALL');
  assert.equal(lookupUnxeenFormula(5, 8), 'BIG');

  // Top 9
  assert.equal(lookupUnxeenFormula(1, 9), 'BIG');
  assert.equal(lookupUnxeenFormula(2, 9), 'BIG');
  assert.equal(lookupUnxeenFormula(3, 9), 'BIG');
  assert.equal(lookupUnxeenFormula(4, 9), 'SMALL');
  assert.equal(lookupUnxeenFormula(0, 9), 'SMALL');
  assert.equal(lookupUnxeenFormula(5, 9), 'SMALL');
});

test('predictNextUnxeen calculates counts and applies formula correctly', () => {
  // Mock history where latest 5 are:
  // [0] 9 (Big)
  // [1] 8 (Big)
  // [2] 7 (Big)
  // [3] 6 (Big)
  // [4] 2 (Small)
  // Total Small = 1, Big = 4, Top = 9 -> MUST predict BIG!
  const history: DrawRecord[] = [
    { issueNumber: '20261031000100', number: 9, size: 'BIG', color: 'green' },
    { issueNumber: '20261031000099', number: 8, size: 'BIG', color: 'red' },
    { issueNumber: '20261031000098', number: 7, size: 'BIG', color: 'green' },
    { issueNumber: '20261031000097', number: 6, size: 'BIG', color: 'red' },
    { issueNumber: '20261031000096', number: 2, size: 'SMALL', color: 'red' },
  ];

  const pred = predictNextUnxeen(history, 'PATTERN');
  assert.ok(pred !== null);
  assert.equal(pred.smallCount, 1);
  assert.equal(pred.bigCount, 4);
  assert.equal(pred.topResult, 9);
  assert.equal(pred.predictedSize, 'BIG');
  assert.equal(pred.issueNumber, '20261031000101');
  assert.equal(pred.formulaCode, 'S-1/B-4]9=BIG');
  // Check numbers are in the BIG category (5, 6, 7, 8, 9)
  assert.ok(pred.predictedNumbers[0] >= 5);
  assert.ok(pred.predictedNumbers[1] >= 5);
});

test('evaluatePrediction returns WIN, JACKPOT, and LOSS accurately', () => {
  const pred = {
    issueNumber: '20261031000101',
    baseOnIssue: '20261031000100',
    predictedSize: 'BIG' as const,
    predictedNumbers: [7, 9] as [number, number],
    smallCount: 1,
    bigCount: 4,
    topResult: 9,
    confidence: 85,
    formulaCode: 'S-1/B-4]9=BIG',
    strategy: 'PATTERN' as const,
    status: 'PENDING' as const,
    timestamp: Date.now(),
  };

  // 1. Result is 7 (BIG) -> Matches both size AND one of dual numbers -> JACKPOT!
  const jackpotDraw: DrawRecord = {
    issueNumber: '20261031000101',
    number: 7,
    size: 'BIG',
    color: 'green',
  };
  assert.equal(evaluatePrediction(pred, jackpotDraw), 'JACKPOT');

  // 2. Result is 8 (BIG) -> Matches size, but not in [7, 9] -> WIN
  const winDraw: DrawRecord = {
    issueNumber: '20261031000101',
    number: 8,
    size: 'BIG',
    color: 'red',
  };
  assert.equal(evaluatePrediction(pred, winDraw), 'WIN');

  // 3. Result is 3 (SMALL) -> Size doesn't match -> LOSS
  const lossDraw: DrawRecord = {
    issueNumber: '20261031000101',
    number: 3,
    size: 'SMALL',
    color: 'green',
  };
  assert.equal(evaluatePrediction(pred, lossDraw), 'LOSS');
});

test('predictNextUnxeen inverts prediction after a LOSS (User explicit rule)', () => {
  // Case where formula gives BIG: (S=1, B=4, Top=9 -> BIG)
  const history: DrawRecord[] = [
    { issueNumber: '20261031000100', number: 9, size: 'BIG', color: 'green' },
    { issueNumber: '20261031000099', number: 8, size: 'BIG', color: 'red' },
    { issueNumber: '20261031000098', number: 7, size: 'BIG', color: 'green' },
    { issueNumber: '20261031000097', number: 6, size: 'BIG', color: 'red' },
    { issueNumber: '20261031000096', number: 2, size: 'SMALL', color: 'red' },
  ];

  // 1. Normal / After WIN: Formula predicts BIG
  const predWin = predictNextUnxeen(history, 'PATTERN', 'WIN');
  assert.ok(predWin !== null);
  assert.equal(predWin.predictedSize, 'BIG');
  assert.equal(predWin.isInverted, false);
  assert.ok(predWin.predictedNumbers.every((n) => n >= 5));

  // 2. After LOSS: Pattern MUST invert! BIG becomes SMALL!
  const predLoss = predictNextUnxeen(history, 'PATTERN', 'LOSS');
  assert.ok(predLoss !== null);
  assert.equal(predLoss.predictedSize, 'SMALL', 'Should invert BIG to SMALL on LOSS');
  assert.equal(predLoss.isInverted, true);
  // Numbers must be selected from the SMALL category (0, 1, 2, 3, 4)
  assert.ok(predLoss.predictedNumbers.every((n) => n < 5));
});
