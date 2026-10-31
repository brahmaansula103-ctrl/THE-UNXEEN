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

export interface PredictionRecord {
  id: string;
  issueNumber: string;
  baseOnIssue: string;
  predictedSize: SizeCategory;
  predictedNumbers: [number, number];
  smallCount: number;
  bigCount: number;
  topResult: number;
  confidence: number;
  formulaCode: string;
  strategy: 'PATTERN' | 'NEURAL' | 'SPLIT';
  status: WinResultType;
  isInverted?: boolean;
  actualNumber?: number;
  actualSize?: SizeCategory;
  timestamp: number;
}

export interface StatsSummary {
  total: number;
  wins: number;
  jackpots: number;
  losses: number;
  winRate: number;
}
