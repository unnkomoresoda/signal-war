import { Company, CompanyId, Ward, WardId, GameState } from '@/types/game';

// Companies data
export const COMPANIES: Record<CompanyId, Omit<Company, 'cash' | 'baseStations'>> = {
  kinoko: {
    id: 'kinoko',
    name: 'kinoko',
    description: '通信品質最強',
    specialty: 'quality',
    color: '#3B82F6', // Blue
    brand: 75,
    reputation: 70,
  },
  zeroten: {
    id: 'zeroten',
    name: 'ZEROTEN',
    description: '価格破壊',
    specialty: 'price',
    color: '#EF4444', // Red
    brand: 60,
    reputation: 65,
  },
  dogpunk: {
    id: 'dogpunk',
    name: 'ドッグパンク',
    description: 'SNS最強',
    specialty: 'sns',
    color: '#EC4899', // Pink
    brand: 70,
    reputation: 75,
  },
  dadaslip: {
    id: 'dadaslip',
    name: 'ダダ滑りCM',
    description: '広告最強',
    specialty: 'advertising',
    color: '#F59E0B', // Amber
    brand: 65,
    reputation: 60,
  },
};

// Wards data (5 wards for MVP)
export const WARDS: Record<WardId, Ward> = {
  shibuya: {
    id: 'shibuya',
    name: '渋谷区',
    population: 220000,
    income: 'high',
    youngRate: 65,
    elderlyRate: 15,
    corporateRate: 30,
    snsSensitivity: 85,
    brandOrientation: 80,
    priceOrientation: 40,
    qualityOrientation: 70,
  },
  shinjuku: {
    id: 'shinjuku',
    name: '新宿区',
    population: 340000,
    income: 'high',
    youngRate: 60,
    elderlyRate: 18,
    corporateRate: 50,
    snsSensitivity: 75,
    brandOrientation: 70,
    priceOrientation: 50,
    qualityOrientation: 75,
  },
  minato: {
    id: 'minato',
    name: '港区',
    population: 250000,
    income: 'high',
    youngRate: 55,
    elderlyRate: 20,
    corporateRate: 60,
    snsSensitivity: 70,
    brandOrientation: 85,
    priceOrientation: 30,
    qualityOrientation: 80,
  },
  chiyoda: {
    id: 'chiyoda',
    name: '千代田区',
    population: 65000,
    income: 'high',
    youngRate: 50,
    elderlyRate: 25,
    corporateRate: 80,
    snsSensitivity: 60,
    brandOrientation: 75,
    priceOrientation: 40,
    qualityOrientation: 85,
  },
  koto: {
    id: 'koto',
    name: '江東区',
    population: 280000,
    income: 'medium',
    youngRate: 55,
    elderlyRate: 22,
    corporateRate: 40,
    snsSensitivity: 65,
    brandOrientation: 60,
    priceOrientation: 60,
    qualityOrientation: 70,
  },
};

// Initial game state
export function createInitialGameState(): GameState {
  const companies: Record<CompanyId, Company> = {
    kinoko: { ...COMPANIES.kinoko, cash: 1000000, baseStations: 5 },
    zeroten: { ...COMPANIES.zeroten, cash: 1000000, baseStations: 5 },
    dogpunk: { ...COMPANIES.dogpunk, cash: 1000000, baseStations: 5 },
    dadaslip: { ...COMPANIES.dadaslip, cash: 1000000, baseStations: 5 },
  };

  const wardShares: Record<WardId, any> = {
    shibuya: {
      wardId: 'shibuya',
      shares: { kinoko: 30, zeroten: 25, dogpunk: 25, dadaslip: 20 },
      residents: [],
    },
    shinjuku: {
      wardId: 'shinjuku',
      shares: { kinoko: 30, zeroten: 25, dogpunk: 25, dadaslip: 20 },
      residents: [],
    },
    minato: {
      wardId: 'minato',
      shares: { kinoko: 30, zeroten: 25, dogpunk: 25, dadaslip: 20 },
      residents: [],
    },
    chiyoda: {
      wardId: 'chiyoda',
      shares: { kinoko: 30, zeroten: 25, dogpunk: 25, dadaslip: 20 },
      residents: [],
    },
    koto: {
      wardId: 'koto',
      shares: { kinoko: 30, zeroten: 25, dogpunk: 25, dadaslip: 20 },
      residents: [],
    },
  };

  return {
    turn: 0,
    month: 1,
    year: 2024,
    companies,
    wards: WARDS,
    wardShares,
    events: [],
    gameLog: ['ゲーム開始'],
  };
}

// Utility functions
export function getCompanyColor(companyId: CompanyId): string {
  return COMPANIES[companyId].color;
}

export function getWardName(wardId: WardId): string {
  return WARDS[wardId].name;
}

export function getCompanyName(companyId: CompanyId): string {
  return COMPANIES[companyId].name;
}

// Calculate share change based on actions
export function calculateShareChange(
  currentShare: number,
  wardPreferences: Record<string, number>,
  companySpecialty: string,
  investment: number
): number {
  const preferenceBonus = (wardPreferences[companySpecialty] || 0) * 0.01;
  const investmentBonus = Math.min(investment / 100000, 0.1); // Max 10% from investment
  const change = preferenceBonus + investmentBonus;
  return Math.min(currentShare + change, 100);
}
