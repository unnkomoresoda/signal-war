import { GameState, CompanyId, WardId } from '@/types/game';
import { createEvent, EventType } from './gameMechanics';

// Event generator for random events
export class EventGenerator {
  private state: GameState;

  constructor(state: GameState) {
    this.state = state;
  }

  // Generate random events for a turn
  generateEvents(): void {
    const eventChance = 0.3; // 30% chance of event

    if (Math.random() < eventChance) {
      const eventType = this.selectRandomEventType();
      const event = this.createEventForType(eventType);

      if (event) {
        this.state.events.push(event);
        this.applyEventEffects(event);
      }
    }
  }

  // Select random event type
  private selectRandomEventType(): EventType {
    const eventTypes: EventType[] = [
      'communication_failure',
      'celebrity_campaign',
      'regulation',
      'ai_service',
      'viral_moment',
      'competitor_move',
    ];

    return eventTypes[Math.floor(Math.random() * eventTypes.length)];
  }

  // Create event for type
  private createEventForType(type: EventType): any {
    const turn = this.state.turn;
    const companyIds: CompanyId[] = ['kinoko', 'zeroten', 'dogpunk', 'dadaslip'];
    const wardIds: WardId[] = ['shibuya', 'shinjuku', 'minato', 'chiyoda', 'koto'];

    let affectedCompanies: CompanyId[] = [];
    let affectedWards: WardId[] = [];

    switch (type) {
      case 'communication_failure':
        // Random company affected
        affectedCompanies = [companyIds[Math.floor(Math.random() * companyIds.length)]];
        affectedWards = [wardIds[Math.floor(Math.random() * wardIds.length)]];
        break;

      case 'celebrity_campaign':
        // Random company benefits
        affectedCompanies = [companyIds[Math.floor(Math.random() * companyIds.length)]];
        break;

      case 'regulation':
        // All companies affected
        affectedCompanies = companyIds;
        break;

      case 'ai_service':
        // Random company adopts AI
        affectedCompanies = [companyIds[Math.floor(Math.random() * companyIds.length)]];
        break;

      case 'viral_moment':
        // Random company goes viral
        affectedCompanies = [companyIds[Math.floor(Math.random() * companyIds.length)]];
        break;

      case 'competitor_move':
        // Two companies compete
        affectedCompanies = [
          companyIds[Math.floor(Math.random() * companyIds.length)],
          companyIds[Math.floor(Math.random() * companyIds.length)],
        ];
        break;
    }

    return createEvent(type, turn, affectedCompanies, affectedWards);
  }

  // Apply event effects to game state
  private applyEventEffects(event: any): void {
    switch (event.type) {
      case 'communication_failure':
        this.applyCommunicationFailure(event);
        break;

      case 'celebrity_campaign':
        this.applyCelebrityCampaign(event);
        break;

      case 'regulation':
        this.applyRegulation(event);
        break;

      case 'ai_service':
        this.applyAIService(event);
        break;

      case 'viral_moment':
        this.applyViralMoment(event);
        break;

      case 'competitor_move':
        this.applyCompetitorMove(event);
        break;
    }

    // Add log entry
    this.state.gameLog.push(`📢 イベント: ${event.title}`);
  }

  // Communication failure
  private applyCommunicationFailure(event: any): void {
    event.affectedCompanies.forEach((companyId: CompanyId) => {
      const company = this.state.companies[companyId];
      company.reputation = Math.max(0, company.reputation - 15);

      // Lose share in affected ward
      if (event.affectedWards.length > 0) {
        const wardShare = this.state.wardShares[event.affectedWards[0] as WardId];
        wardShare.shares[companyId] = Math.max(0, wardShare.shares[companyId] - 5);
      }
    });
  }

  // Celebrity campaign
  private applyCelebrityCampaign(event: any): void {
    event.affectedCompanies.forEach((companyId: CompanyId) => {
      const company = this.state.companies[companyId];
      company.brand = Math.min(100, company.brand + 20);
      company.reputation = Math.min(100, company.reputation + 15);

      // Gain share in all wards
      Object.values(this.state.wardShares).forEach((wardShare) => {
        wardShare.shares[companyId] = Math.min(100, wardShare.shares[companyId] + 3);
      });
    });
  }

  // Regulation
  private applyRegulation(event: any): void {
    // All companies lose some revenue
    event.affectedCompanies.forEach((companyId: CompanyId) => {
      const company = this.state.companies[companyId];
      company.cash = Math.max(0, company.cash - 100000);
    });
  }

  // AI Service
  private applyAIService(event: any): void {
    event.affectedCompanies.forEach((companyId: CompanyId) => {
      const company = this.state.companies[companyId];
      company.cash = Math.max(0, company.cash - 100000);
      company.reputation = Math.min(100, company.reputation + 10);

      // Slight share gain from efficiency
      Object.values(this.state.wardShares).forEach((wardShare) => {
        wardShare.shares[companyId] = Math.min(100, wardShare.shares[companyId] + 1);
      });
    });
  }

  // Viral moment
  private applyViralMoment(event: any): void {
    event.affectedCompanies.forEach((companyId: CompanyId) => {
      const company = this.state.companies[companyId];
      company.brand = Math.min(100, company.brand + 25);

      // Gain share in all wards
      Object.values(this.state.wardShares).forEach((wardShare) => {
        wardShare.shares[companyId] = Math.min(100, wardShare.shares[companyId] + 2);
      });
    });
  }

  // Competitor move
  private applyCompetitorMove(event: any): void {
    if (event.affectedCompanies.length >= 2) {
      const winner = event.affectedCompanies[0] as CompanyId;
      const loser = event.affectedCompanies[1] as CompanyId;

      // Winner gains, loser loses
      Object.values(this.state.wardShares).forEach((wardShare) => {
        const transfer = 2;
        wardShare.shares[winner] = Math.min(100, wardShare.shares[winner] + transfer);
        wardShare.shares[loser] = Math.max(0, wardShare.shares[loser] - transfer);
      });
    }
  }
}

// Normalize shares to ensure they sum to 100
export function normalizeWardShares(state: GameState): void {
  Object.values(state.wardShares).forEach((wardShare) => {
    const total = Object.values(wardShare.shares).reduce((a, b) => a + b, 0);

    if (total !== 100) {
      const scale = 100 / total;
      (Object.entries(wardShare.shares) as [CompanyId, number][]).forEach(([companyId]) => {
        wardShare.shares[companyId] = Math.round(wardShare.shares[companyId] * scale);
      });

      // Ensure total is exactly 100
      const actualTotal = Object.values(wardShare.shares).reduce((a, b) => a + b, 0);
      if (actualTotal !== 100) {
        const diff = 100 - actualTotal;
        const firstCompany = (Object.keys(wardShare.shares)[0] as CompanyId);
        wardShare.shares[firstCompany] += diff;
      }
    }
  });
}
