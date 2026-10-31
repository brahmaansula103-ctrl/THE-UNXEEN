/**
 * THE UNXEEN 🔞 V14.ZYX PRO - WinGo Pattern & AI Prediction Engine
 * Implements the complete master formula from the user's research notebook.
 */

export type SizeCategory = 'BIG' | 'SMALL';
export type WinResultType = 'WIN' | 'JACKPOT' | 'LOSS' | 'PENDING';
export type GameMode = 'WinGo_30S' | 'WinGo_1M' | 'WinGo_3M' | 'WinGo_5M';

export interface DrawRecord {
  issueNumber: string;
  number: number;
  size: SizeCategory;
  color: 'green' | 'red' | 'violet' | 'red-violet' | 'green-violet';
  openTime?: string;
}

export interface PredictionResult {
  issueNumber: string; // The upcoming issue being predicted
  baseOnIssue: string; // The latest issue used for the calculation
  predictedSize: SizeCategory;
  predictedNumbers: [number, number];
  smallCount: number;
  bigCount: number;
  topResult: number;
  confidence: number;
  formulaCode: string; // e.g. "S-1/B-4]9=BIG"
  strategy: 'PATTERN' | 'NEURAL' | 'SPLIT';
  status: WinResultType;
  isInverted?: boolean;
  actualNumber?: number;
  actualSize?: SizeCategory;
  timestamp: number;
}

/**
 * Master Table transcribed from notebook:
 * Key: `${smallCount}_${topResult}` -> predicted SizeCategory
 * Note: bigCount = 5 - smallCount
 */
const UNXEEN_MASTER_FORMULA: Record<number, Record<number, SizeCategory>> = {
  // Top Result 0
  0: {
    1: 'SMALL', // S1/B4 ] 0 = Small
    2: 'SMALL', // S2/B3 ] 0 = Small
    3: 'BIG',   // S3/B2 ] 0 = Big
    4: 'BIG',   // S4/B1 ] 0 = Big
    0: 'BIG',   // S0/B5 ] 0 = Big
    5: 'SMALL', // S5/B0 ] 0 = Small
  },
  // Top Result 1 (Inverted per user request: Big -> Small, Small -> Big)
  1: {
    1: 'BIG',   // Inverted from SMALL
    2: 'SMALL', // Inverted from BIG
    3: 'SMALL', // Inverted from BIG
    4: 'SMALL', // Inverted from BIG
    5: 'BIG',   // Inverted from SMALL
    0: 'BIG',   // Inverted from SMALL
  },
  // Top Result 2
  2: {
    1: 'BIG',   // S1/B4 ] 2 = Big
    2: 'SMALL', // S2/B3 ] 2 = Small
    3: 'SMALL', // S3/B2 ] 2 = Small
    4: 'BIG',   // S4/B1 ] 2 = Big
    0: 'SMALL', // S0/B5 ] 2 = Small
    5: 'SMALL', // S5/B0 ] 2 = Small
  },
  // Top Result 3 (Inverted per user request: Big -> Small, Small -> Big)
  3: {
    1: 'SMALL', // Inverted from BIG
    2: 'BIG',   // Inverted from SMALL
    3: 'SMALL', // Inverted from BIG
    4: 'SMALL', // Inverted from BIG
    0: 'BIG',   // Inverted from SMALL
    5: 'SMALL', // Inverted from BIG
  },
  // Top Result 4
  4: {
    1: 'BIG',   // S1/B4 ] 4 = Big
    2: 'SMALL', // S2/B3 ] 4 = Small
    3: 'BIG',   // S3/B2 ] 4 = Big
    4: 'BIG',   // S4/B1 ] 4 = Big
    5: 'BIG',   // S5/B0 ] 4 = Big
    0: 'SMALL', // S0/B5 ] 4 = Small
  },
  // Top Result 5 (Inverted per user request: Big -> Small, Small -> Big)
  5: {
    1: 'BIG',   // Inverted from SMALL
    2: 'BIG',   // Inverted from SMALL
    3: 'SMALL', // Inverted from BIG
    4: 'SMALL', // Inverted from BIG
    5: 'SMALL', // Inverted from BIG
    0: 'SMALL', // Inverted from BIG
  },
  // Top Result 6
  6: {
    1: 'BIG',   // S1/B4 ] 6 = Big
    2: 'BIG',   // S2/B3 ] 6 = Big
    3: 'SMALL', // S3/B2 ] 6 = Small
    4: 'BIG',   // S4/B1 ] 6 = Big
    5: 'BIG',   // S5/B0 ] 6 = Big
    0: 'SMALL', // S0/B5 ] 6 = Small
  },
  // Top Result 7
  7: {
    1: 'SMALL', // S1/B4 ] 7 = Small
    2: 'SMALL', // S2/B3 ] 7 = Small
    3: 'BIG',   // S3/B2 ] 7 = Big
    4: 'BIG',   // S4/B1 ] 7 = Big
    5: 'BIG',   // S5/B0 ] 7 = Big
    0: 'SMALL', // S0/B5 ] 7 = Small
  },
  // Top Result 8
  8: {
    1: 'SMALL', // S1/B4 ] 8 = Small
    2: 'SMALL', // S2/B3 ] 8 = Small
    3: 'BIG',   // S3/B2 ] 8 = Big
    4: 'SMALL', // S4/B1 ] 8 = Small
    5: 'BIG',   // S5/B0 ] 8 = Big
    0: 'BIG',   // S0/B5 ] 8 = Big
  },
  // Top Result 9
  9: {
    1: 'BIG',   // S1/B4 ] 9 = Big (User explicit example!)
    2: 'BIG',   // S2/B3 ] 9 = Big
    3: 'BIG',   // S3/B2 ] 9 = Big
    4: 'SMALL', // S4/B1 ] 9 = Small
    0: 'SMALL', // S0/B5 ] 9 = Small
    5: 'SMALL', // S5/B0 ] 9 = Small
  },
};

/**
 * Helper to identify size of a number
 */
export function getNumberSize(num: number): SizeCategory {
  return num >= 5 ? 'BIG' : 'SMALL';
}

/**
 * Helper to get WinGo color for a number
 */
export function getNumberColor(num: number): 'green' | 'red' | 'violet' | 'red-violet' | 'green-violet' {
  if (num === 0) return 'red-violet';
  if (num === 5) return 'green-violet';
  if ([1, 3, 7, 9].includes(num)) return 'green';
  return 'red';
}

/**
 * Extract next issue number from current issue
 */
export function getNextIssueNumber(currentIssue: string): string {
  if (!currentIssue) return '';
  try {
    const bigIntVal = BigInt(currentIssue);
    return (bigIntVal + 1n).toString();
  } catch {
    const num = parseInt(currentIssue, 10);
    return isNaN(num) ? `${currentIssue}_next` : (num + 1).toString();
  }
}

/**
 * Look up the exact V14 formula result based on smallCount and topResult
 */
export function lookupUnxeenFormula(smallCount: number, topResult: number): SizeCategory {
  const topTable = UNXEEN_MASTER_FORMULA[topResult];
  if (!topTable || topTable[smallCount] === undefined) {
    // Fallback if unexpected
    return smallCount <= 2 ? 'BIG' : 'SMALL';
  }
  return topTable[smallCount];
}

/**
 * Pick the two most probable numbers in the target category based on historical frequency and transition
 */
export function selectDualPredictedNumbers(
  targetSize: SizeCategory,
  recentHistory: DrawRecord[]
): [number, number] {
  const candidates = targetSize === 'BIG' ? [5, 6, 7, 8, 9] : [0, 1, 2, 3, 4];
  
  // Count frequency of recent occurrences (past 20 draws if available)
  const frequencyMap: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  const historySlice = recentHistory.slice(0, 20);
  
  historySlice.forEach((h, index) => {
    // Weight recent hits slightly higher
    const recencyWeight = (20 - index) / 20;
    frequencyMap[h.number] = (frequencyMap[h.number] || 0) + 1 + recencyWeight;
  });

  // Calculate score for each candidate
  // In probability games, both hot numbers and overdue numbers can be favored.
  // We combine moderate hotness with complementary parity (one odd, one even)
  const scored = candidates.map((num) => {
    const freq = frequencyMap[num] || 0;
    // Add deterministic pseudo-seed based on the latest draw's issue
    const seed = recentHistory[0] ? (parseInt(recentHistory[0].issueNumber.slice(-3), 10) || 1) : 1;
    const parityBonus = (num + seed) % 2 === 0 ? 0.4 : 0.2;
    return { num, score: freq + parityBonus };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Return the top 2 candidates
  let first = scored[0]?.num ?? candidates[0];
  let second = scored[1]?.num ?? candidates[1];

  // Ensure they are sorted for visual consistency
  if (first > second) {
    const temp = first;
    first = second;
    second = temp;
  }

  return [first, second];
}

/**
 * Calculate dynamic confidence score (e.g. 74% - 94%)
 */
export function calculateConfidence(
  smallCount: number,
  bigCount: number,
  topResult: number,
  strategy: 'PATTERN' | 'NEURAL' | 'SPLIT'
): number {
  let base = 80;
  // Strong imbalance (e.g. 4-1 or 5-0) gives higher confidence
  const imbalance = Math.abs(smallCount - bigCount);
  base += imbalance * 2.5; // +5 to +10

  if (strategy === 'NEURAL') base += 3;
  if (strategy === 'SPLIT') base -= 4;

  // Add deterministic variance based on top result
  base += (topResult % 4);

  return Math.min(96, Math.max(72, Math.round(base)));
}

/**
 * Core prediction function
 */
export function predictNextUnxeen(
  history: DrawRecord[],
  strategy: 'PATTERN' | 'NEURAL' | 'SPLIT' = 'PATTERN',
  lastOutcome?: WinResultType | null
): PredictionResult | null {
  if (!history || history.length < 5) {
    return null;
  }

  // Top 5 latest results (index 0 is latest / top result)
  const top5 = history.slice(0, 5);
  const latestDraw = top5[0];

  let smallCount = 0;
  let bigCount = 0;

  top5.forEach((item) => {
    if (item.size === 'BIG') {
      bigCount++;
    } else {
      smallCount++;
    }
  });

  const topResult = latestDraw.number;
  const normalFormulaSize = lookupUnxeenFormula(smallCount, topResult);

  // Critical User Rule:
  // "jab loss hoga pattern se ulta Prediction karna hai. Jab loss, agar win real pattern se prediction, jab loss pattern se ulta! Pattern small hai to big prediction tik hai"
  const isPostLossInverted = lastOutcome === 'LOSS';
  const predictedSize: SizeCategory = isPostLossInverted
    ? (normalFormulaSize === 'BIG' ? 'SMALL' : 'BIG')
    : normalFormulaSize;

  const predictedNumbers = selectDualPredictedNumbers(predictedSize, history);
  const confidence = calculateConfidence(smallCount, bigCount, topResult, strategy);
  const nextIssue = getNextIssueNumber(latestDraw.issueNumber);
  const formulaCode = isPostLossInverted
    ? `INV[S-${smallCount}/B-${bigCount}]${topResult}=${predictedSize}`
    : `S-${smallCount}/B-${bigCount}]${topResult}=${predictedSize}`;

  return {
    issueNumber: nextIssue,
    baseOnIssue: latestDraw.issueNumber,
    predictedSize,
    predictedNumbers,
    smallCount,
    bigCount,
    topResult,
    confidence,
    formulaCode,
    strategy,
    status: 'PENDING',
    isInverted: isPostLossInverted,
    timestamp: Date.now(),
  };
}

/**
 * Evaluate prediction against actual result
 */
export function evaluatePrediction(
  prediction: PredictionResult,
  actualDraw: DrawRecord
): WinResultType {
  const isSizeWin = actualDraw.size === prediction.predictedSize;
  const isNumberJackpot = prediction.predictedNumbers.includes(actualDraw.number);

  if (isSizeWin && isNumberJackpot) {
    return 'JACKPOT';
  }
  if (isSizeWin) {
    return 'WIN';
  }
  return 'LOSS';
}
