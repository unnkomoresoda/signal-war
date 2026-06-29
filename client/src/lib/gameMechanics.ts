import { CompanyId, WardId } from '@/types/game';
import { COMPANIES, WARDS } from './gameData';

// Base Station System
export interface BaseStation {
  id: string;
  companyId: CompanyId;
  wardId: WardId;
  level: number; // 1-5
  coverage: number; // 0-100
  maintenance: number; // cost per turn
}

export function createBaseStation(
  companyId: CompanyId,
  wardId: WardId,
  level: number = 1
): BaseStation {
  return {
    id: `${companyId}-${wardId}-${Date.now()}`,
    companyId,
    wardId,
    level,
    coverage: level * 20,
    maintenance: level * 10000,
  };
}

export function upgradeBaseStation(station: BaseStation): void {
  if (station.level < 5) {
    station.level += 1;
    station.coverage = station.level * 20;
    station.maintenance = station.level * 10000;
  }
}

// Sales Team System
export interface SalesTeam {
  id: string;
  companyId: CompanyId;
  wardId: WardId;
  effectiveness: number; // 0-100
  salary: number; // per turn
}

export function createSalesTeam(
  companyId: CompanyId,
  wardId: WardId,
  effectiveness: number = 50
): SalesTeam {
  return {
    id: `${companyId}-sales-${wardId}-${Date.now()}`,
    companyId,
    wardId,
    effectiveness,
    salary: 30000,
  };
}

export function calculateSalesImpact(
  team: SalesTeam,
  ward: any,
  companySpecialty: string
): number {
  let baseImpact = team.effectiveness * 0.01;

  // Bonus based on company specialty and ward preference
  if (companySpecialty === 'quality' && ward.qualityOrientation > 70) {
    baseImpact *= 1.5;
  } else if (companySpecialty === 'price' && ward.priceOrientation > 70) {
    baseImpact *= 1.5;
  } else if (companySpecialty === 'sns' && ward.snsSensitivity > 70) {
    baseImpact *= 1.5;
  } else if (companySpecialty === 'advertising' && ward.brandOrientation > 70) {
    baseImpact *= 1.5;
  }

  return baseImpact;
}

// Advertising System
export type AdvertisingChannel = 'tv' | 'sns' | 'station' | 'youtube' | 'tiktok' | 'newspaper';

export interface AdvertisingCampaign {
  id: string;
  companyId: CompanyId;
  wardId: WardId;
  channel: AdvertisingChannel;
  budget: number;
  duration: number; // turns
  effectiveness: number; // 0-100
  riskOfViral: number; // 0-100 (positive or negative)
}

export const ADVERTISING_CHANNELS: Record<AdvertisingChannel, { name: string; costPerTurn: number; baseEffectiveness: number }> = {
  tv: { name: 'テレビ', costPerTurn: 100000, baseEffectiveness: 60 },
  sns: { name: 'SNS', costPerTurn: 50000, baseEffectiveness: 80 },
  station: { name: '駅広告', costPerTurn: 30000, baseEffectiveness: 50 },
  youtube: { name: 'YouTube', costPerTurn: 40000, baseEffectiveness: 70 },
  tiktok: { name: 'TikTok', costPerTurn: 60000, baseEffectiveness: 85 },
  newspaper: { name: '新聞', costPerTurn: 20000, baseEffectiveness: 40 },
};

export function createAdvertisingCampaign(
  companyId: CompanyId,
  wardId: WardId,
  channel: AdvertisingChannel,
  budget: number,
  duration: number = 3
): AdvertisingCampaign {
  const channelData = ADVERTISING_CHANNELS[channel];
  return {
    id: `${companyId}-ad-${wardId}-${Date.now()}`,
    companyId,
    wardId,
    channel,
    budget,
    duration,
    effectiveness: channelData.baseEffectiveness,
    riskOfViral: Math.random() * 100,
  };
}

export function calculateAdvertisingImpact(
  campaign: AdvertisingCampaign,
  ward: any,
  companySpecialty: string
): { shareGain: number; brandGain: number; viralRisk: number } {
  const channelData = ADVERTISING_CHANNELS[campaign.channel];
  let effectiveness = channelData.baseEffectiveness;

  // Bonus for SNS channels in SNS-sensitive wards
  if ((campaign.channel === 'sns' || campaign.channel === 'tiktok') && ward.snsSensitivity > 70) {
    effectiveness *= 1.3;
  }

  // Bonus for TV in brand-oriented wards
  if (campaign.channel === 'tv' && ward.brandOrientation > 70) {
    effectiveness *= 1.3;
  }

  const shareGain = (campaign.budget / 100000) * (effectiveness / 100);
  const brandGain = (campaign.budget / 100000) * 2;
  const viralRisk = campaign.riskOfViral;

  return { shareGain, brandGain, viralRisk };
}

// Pricing System
export interface PricingStrategy {
  companyId: CompanyId;
  level: 'budget' | 'standard' | 'premium'; // -1, 0, +1
  monthlyRevenue: number;
  churnMultiplier: number; // 1.0 = normal, 1.5 = high churn
}

export const PRICING_LEVELS: Record<'budget' | 'standard' | 'premium', { name: string; monthlyPrice: number; churnMultiplier: number }> = {
  budget: { name: '予算重視', monthlyPrice: 2000, churnMultiplier: 0.7 },
  standard: { name: '標準', monthlyPrice: 3000, churnMultiplier: 1.0 },
  premium: { name: 'プレミアム', monthlyPrice: 4500, churnMultiplier: 1.3 },
};

export function createPricingStrategy(
  companyId: CompanyId,
  level: 'budget' | 'standard' | 'premium' = 'standard'
): PricingStrategy {
  const levelData = PRICING_LEVELS[level];
  return {
    companyId,
    level,
    monthlyRevenue: levelData.monthlyPrice,
    churnMultiplier: levelData.churnMultiplier,
  };
}

export function calculateRevenueImpact(
  strategy: PricingStrategy,
  subscribers: number
): number {
  return strategy.monthlyRevenue * subscribers;
}

// Employee System (simplified)
export interface Employee {
  id: string;
  companyId: CompanyId;
  department: 'sales' | 'technology' | 'advertising' | 'support' | 'research';
  effectiveness: number; // 0-100
  salary: number; // per turn
  experience: number; // 0-100
}

export function createEmployee(
  companyId: CompanyId,
  department: Employee['department'],
  effectiveness: number = 50
): Employee {
  return {
    id: `${companyId}-emp-${Date.now()}`,
    companyId,
    department,
    effectiveness,
    salary: 50000,
    experience: 0,
  };
}

export function trainEmployee(employee: Employee): void {
  employee.effectiveness = Math.min(100, employee.effectiveness + 5);
  employee.experience = Math.min(100, employee.experience + 10);
}

export function promoteEmployee(employee: Employee): number {
  // Promotion cost
  return employee.salary * 3;
}

// Event System
export type EventType = 'communication_failure' | 'celebrity_campaign' | 'regulation' | 'ai_service' | 'viral_moment' | 'competitor_move';

export interface GameEvent {
  id: string;
  type: EventType;
  turn: number;
  title: string;
  description: string;
  affectedCompanies: CompanyId[];
  affectedWards: WardId[];
  impact: Record<CompanyId, number>; // -100 to 100
}

export const EVENT_TEMPLATES: Record<EventType, { title: string; description: string }> = {
  communication_failure: {
    title: '通信障害発生',
    description: '予期しない通信障害が発生しました。ユーザー満足度が低下します。',
  },
  celebrity_campaign: {
    title: '芸能人起用キャンペーン',
    description: '有名芸能人を起用したキャンペーンが大成功。ブランド価値が上昇します。',
  },
  regulation: {
    title: '総務省命令',
    description: '総務省から料金値下げ命令が発令されました。',
  },
  ai_service: {
    title: 'AI接客導入',
    description: 'AI接客サービスを導入。人件費が削減されます。',
  },
  viral_moment: {
    title: 'SNSバズ',
    description: 'SNS上でバズが発生。ブランド認知度が急上昇します。',
  },
  competitor_move: {
    title: '競合企業の動き',
    description: '競合企業が新しい戦略を展開しました。',
  },
};

export function createEvent(
  type: EventType,
  turn: number,
  affectedCompanies: CompanyId[] = [],
  affectedWards: WardId[] = []
): GameEvent {
  const template = EVENT_TEMPLATES[type];
  const impact: Record<CompanyId, number> = {
    kinoko: 0,
    zeroten: 0,
    dogpunk: 0,
    dadaslip: 0,
  };

  affectedCompanies.forEach((company) => {
    impact[company] = Math.random() * 200 - 100;
  });

  return {
    id: `event-${turn}-${Date.now()}`,
    type,
    turn,
    title: template.title,
    description: template.description,
    affectedCompanies,
    affectedWards,
    impact,
  };
}
