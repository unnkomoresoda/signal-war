// Game Types for PROJECT SIGNAL WAR

// Companies (4 companies)
export type CompanyId = 'kinoko' | 'zeroten' | 'dogpunk' | 'dadaslip';

export interface Company {
  id: CompanyId;
  name: string;
  description: string;
  specialty: 'quality' | 'price' | 'sns' | 'advertising';
  color: string;
  baseStations: number;
  cash: number;
  brand: number; // 0-100
  reputation: number; // 0-100
}

// Wards (5 wards for MVP)
export type WardId = 'shibuya' | 'shinjuku' | 'minato' | 'chiyoda' | 'koto';

export interface Ward {
  id: WardId;
  name: string;
  population: number;
  income: 'low' | 'medium' | 'high';
  youngRate: number; // 0-100
  elderlyRate: number; // 0-100
  corporateRate: number; // 0-100
  snsSensitivity: number; // 0-100
  brandOrientation: number; // 0-100
  priceOrientation: number; // 0-100
  qualityOrientation: number; // 0-100
}

// Resident (simplified)
export interface Resident {
  id: string;
  wardId: WardId;
  workWardId: WardId;
  age: number;
  preference: 'quality' | 'price' | 'sns' | 'advertising' | 'brand';
  currentProvider: CompanyId | null;
  satisfaction: number; // 0-100
  churnRisk: number; // 0-100
}

// Share data per ward
export interface WardShare {
  wardId: WardId;
  shares: Record<CompanyId, number>; // percentage
  residents: Resident[];
}

// Game state
export interface GameState {
  turn: number;
  month: number; // 1-12
  year: number;
  companies: Record<CompanyId, Company>;
  wards: Record<WardId, Ward>;
  wardShares: Record<WardId, WardShare>;
  events: GameEvent[];
  gameLog: string[];
}

// Game events
export interface GameEvent {
  id: string;
  turn: number;
  type: 'communication_failure' | 'celebrity_campaign' | 'regulation' | 'ai_service' | 'viral_moment' | 'competitor_move';
  title: string;
  description: string;
  affectedCompanies?: CompanyId[];
  affectedWards?: WardId[];
  impact: Record<CompanyId, number>; // impact on each company
}

// Game actions
export interface GameAction {
  type: 'place_base_station' | 'move_sales_team' | 'run_advertising' | 'change_pricing' | 'hire_employee' | 'end_turn';
  companyId: CompanyId;
  wardId?: WardId;
  data?: Record<string, any>;
}

// Win conditions
export interface WinCondition {
  type: 'territory' | 'subscribers' | 'profit' | 'brand' | 'stock_price';
  threshold: number;
  description: string;
}
