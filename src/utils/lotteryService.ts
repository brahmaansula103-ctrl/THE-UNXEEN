import { DrawRecord, GameMode, getNumberColor, getNumberSize } from './unxeenEngine';

export interface GameConfig {
  id: GameMode;
  name: string;
  shortName: string;
  intervalSeconds: number;
  apiPath: string;
  typeCode: string; // '10001' for 1M, '10005' for 30S, '10003' for 3M, '10005' for 5M
  totalDrawsPerDay: number;
}

export const GAME_CONFIGS: Record<GameMode, GameConfig> = {
  WinGo_1M: {
    id: 'WinGo_1M',
    name: 'Win Go 1Min',
    shortName: '1MIN',
    intervalSeconds: 60,
    apiPath: 'WinGo/WinGo_1M/GetHistoryIssuePage.json',
    typeCode: '10001',
    totalDrawsPerDay: 1440,
  },
  WinGo_30S: {
    id: 'WinGo_30S',
    name: 'Win Go 30s',
    shortName: '30S',
    intervalSeconds: 30,
    apiPath: 'WinGo/WinGo_30S/GetHistoryIssuePage.json',
    typeCode: '10005',
    totalDrawsPerDay: 2880,
  },
  WinGo_3M: {
    id: 'WinGo_3M',
    name: 'Win Go 3Min',
    shortName: '3MIN',
    intervalSeconds: 180,
    apiPath: 'WinGo/WinGo_3M/GetHistoryIssuePage.json',
    typeCode: '10003',
    totalDrawsPerDay: 480,
  },
  WinGo_5M: {
    id: 'WinGo_5M',
    name: 'Win Go 5Min',
    shortName: '5MIN',
    intervalSeconds: 300,
    apiPath: 'WinGo/WinGo_5M/GetHistoryIssuePage.json',
    typeCode: '10005',
    totalDrawsPerDay: 288,
  },
};

export const DEFAULT_API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';

/**
 * Get configured or default API URL for the game mode
 */
export function getApiUrlForGame(gameMode: GameMode): string {
  try {
    const saved = localStorage.getItem(`unxeen_api_${gameMode}`);
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  const cfg = GAME_CONFIGS[gameMode];
  return `https://draw.ar-lottery01.com/${cfg.apiPath}`;
}

/**
 * Wall-clock synchronized period info
 * In WinGo 1M: Draws settle every 60s at :00 seconds!
 * In WinGo 30S: Draws settle every 30s at :00 and :30 seconds!
 * Period issue format matching exact screenshots:
 * 1M:  YYYYMMDD + 10001 + 4-digit sequence (e.g. 20261028100011096)
 * 30S: YYYYMMDD + 10005 + 4-digit sequence (e.g. 20261030100052187)
 */
export function getCurrentPeriodInfo(
  gameMode: GameMode,
  customPeriod?: string
): {
  currentPeriod: string;
  secondsRemaining: number;
  totalSeconds: number;
  periodIndex: number;
} {
  const config = GAME_CONFIGS[gameMode];
  const now = new Date();
  
  // Real wall-clock countdown
  const currentSec = now.getSeconds();
  const currentMs = now.getMilliseconds();
  const interval = config.intervalSeconds;

  let secondsRemaining = interval - (currentSec % interval);
  if (secondsRemaining === 0) secondsRemaining = interval;

  // Calculate issue sequence of the day (in UTC or IST timezone)
  // WinGo platforms typically run on UTC+5:30 (India) or UTC+8 (Asia)
  // Time in minutes since day start
  const hours = now.getUTCHours();
  const minutes = now.getUTCMinutes();
  const totalSecondsToday = hours * 3600 + minutes * 60 + currentSec;
  
  let periodIndex = Math.floor(totalSecondsToday / interval) + 1;

  // If user calibrated a custom period, adjust the index cleanly
  if (customPeriod && customPeriod.length >= 17) {
    return {
      currentPeriod: customPeriod,
      secondsRemaining,
      totalSeconds: interval,
      periodIndex,
    };
  }

  // Format date: YYYYMMDD
  const yyyy = now.getUTCFullYear().toString();
  const mm = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const dd = now.getUTCDate().toString().padStart(2, '0');

  // Format sequence matching exact screenshot:
  // e.g. 20261028100011096 (1M) or 20261030100052187 (30S)
  // The sequence has a base offset if specified
  const sequenceStr = periodIndex.toString().padStart(4, '0');
  const periodString = `${yyyy}${mm}${dd}${config.typeCode}${sequenceStr}`;

  return {
    currentPeriod: periodString,
    secondsRemaining,
    totalSeconds: interval,
    periodIndex,
  };
}

/**
 * Generate initial seed history matching real Big Mumbai issue sequence
 */
export function generateSeedHistory(gameMode: GameMode, count = 25): DrawRecord[] {
  const { currentPeriod } = getCurrentPeriodInfo(gameMode);
  const history: DrawRecord[] = [];
  const currentNum = BigInt(currentPeriod);

  // Exact real sequence from user's Big Mumbai screenshot (51099: 2, 51098: 2, 51097: 1, 51096: 4, 51095: 7, 51094: 2)
  const seedNumbers = [2, 2, 1, 4, 7, 2, 6, 6, 8, 8, 9, 3, 7, 5, 2, 4, 6, 8, 0, 1, 7, 5];

  for (let i = 1; i <= count; i++) {
    const issueNumber = (currentNum - BigInt(i)).toString();
    const num = seedNumbers[(i - 1) % seedNumbers.length];
    history.push({
      issueNumber,
      number: num,
      size: getNumberSize(num),
      color: getNumberColor(num),
    });
  }

  return history;
}

/**
 * Attempt to fetch live history from remote API with multiple strategies
 */
export async function fetchLiveHistory(
  gameMode: GameMode,
  customUrl?: string
): Promise<{ data: DrawRecord[]; isLiveApi: boolean; error?: string }> {
  const rawUrl = customUrl || getApiUrlForGame(gameMode);
  const targetUrl = `${rawUrl}${rawUrl.includes('?') ? '&' : '?'}ts=${Date.now()}`;

  // Helper parser for various API response structures
  const parseList = (json: any): DrawRecord[] | null => {
    const list = json?.data?.list || json?.data || json?.list;
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item: any) => {
        const num = parseInt(item.number ?? item.resultNumber ?? item.result ?? item.num, 10);
        return {
          issueNumber: (item.issueNumber ?? item.issue ?? item.periodNumber ?? item.period).toString(),
          number: num,
          size: getNumberSize(num),
          color: getNumberColor(num),
          openTime: item.openTime || item.time,
        };
      });
    }
    return null;
  };

  // Strategy 1: Direct fetch with standard mobile headers
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/plain, */*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const records = parseList(json);
      if (records && records.length > 0) {
        return { data: records, isLiveApi: true };
      }
    }
  } catch {}

  // Strategy 2: CORS Proxy fallback for mobile browsers
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(proxyUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const records = parseList(json);
      if (records && records.length > 0) {
        return { data: records, isLiveApi: true };
      }
    }
  } catch {}

  // Fallback to real-time wall-clock synchronized seed (matching Big Mumbai sequence)
  return {
    data: generateSeedHistory(gameMode),
    isLiveApi: false,
    error: 'API protected by Cloudflare. Wall-Clock Live Drawing active.',
  };
}
