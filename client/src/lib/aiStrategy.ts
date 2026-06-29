import { GameState, CompanyId, WardId, GameAction } from '@/types/game';
import { WARDS, COMPANIES } from './gameData';

// AI Strategy for competing companies
export class AIStrategy {
  private state: GameState;
  private companyId: CompanyId;

  constructor(state: GameState, companyId: CompanyId) {
    this.state = state;
    this.companyId = companyId;
  }

  // Get next action for AI company
  getNextAction(): GameAction | null {
    const company = this.state.companies[this.companyId];
    const specialty = COMPANIES[this.companyId].specialty;

    // If low on cash, be conservative
    if (company.cash < 200000) {
      return this.conservativeAction();
    }

    // Choose action based on specialty
    switch (specialty) {
      case 'quality':
        return this.qualityStrategy();
      case 'price':
        return this.priceStrategy();
      case 'sns':
        return this.snsStrategy();
      case 'advertising':
        return this.advertisingStrategy();
      default:
        return this.balancedStrategy();
    }
  }

  // Quality-focused strategy (kinoko)
  private qualityStrategy(): GameAction | null {
    // Prioritize base station placement in high-quality-oriented wards
    const bestWard = this.findBestWardForStrategy((ward) => ward.qualityOrientation);

    if (bestWard && this.state.companies[this.companyId].cash >= 50000) {
      return {
        type: 'place_base_station',
        companyId: this.companyId,
        wardId: bestWard,
      };
    }

    return null;
  }

  // Price-focused strategy (ZEROTEN)
  private priceStrategy(): GameAction | null {
    // Prioritize sales teams in price-sensitive wards
    const bestWard = this.findBestWardForStrategy((ward) => ward.priceOrientation);

    if (bestWard && this.state.companies[this.companyId].cash >= 30000) {
      return {
        type: 'move_sales_team',
        companyId: this.companyId,
        wardId: bestWard,
      };
    }

    return null;
  }

  // SNS-focused strategy (ドッグパンク)
  private snsStrategy(): GameAction | null {
    // Prioritize advertising in SNS-sensitive wards
    const bestWard = this.findBestWardForStrategy((ward) => ward.snsSensitivity);

    if (bestWard && this.state.companies[this.companyId].cash >= 50000) {
      return {
        type: 'run_advertising',
        companyId: this.companyId,
        wardId: bestWard,
        data: { amount: 50000 },
      };
    }

    return null;
  }

  // Advertising-focused strategy (ダダ滑りCM)
  private advertisingStrategy(): GameAction | null {
    // Prioritize advertising in brand-oriented wards
    const bestWard = this.findBestWardForStrategy((ward) => ward.brandOrientation);

    if (bestWard && this.state.companies[this.companyId].cash >= 100000) {
      return {
        type: 'run_advertising',
        companyId: this.companyId,
        wardId: bestWard,
        data: { amount: 100000 },
      };
    }

    return null;
  }

  // Balanced strategy
  private balancedStrategy(): GameAction | null {
    const actions: GameAction[] = [];

    // Try to place base stations in weak wards
    const weakWards = this.findWeakWards();
    if (weakWards.length > 0 && this.state.companies[this.companyId].cash >= 50000) {
      actions.push({
        type: 'place_base_station',
        companyId: this.companyId,
        wardId: weakWards[0],
      });
    }

    // Try to run advertising
    if (this.state.companies[this.companyId].cash >= 50000) {
      const bestWard = this.findBestWardForStrategy((ward) => ward.snsSensitivity);
      if (bestWard) {
        actions.push({
          type: 'run_advertising',
          companyId: this.companyId,
          wardId: bestWard,
          data: { amount: 50000 },
        });
      }
    }

    return actions.length > 0 ? actions[Math.floor(Math.random() * actions.length)] : null;
  }

  // Conservative strategy (low cash)
  private conservativeAction(): GameAction | null {
    // Focus on cheap sales team moves
    const bestWard = this.findBestWardForStrategy((ward) => ward.priceOrientation);

    if (bestWard && this.state.companies[this.companyId].cash >= 30000) {
      return {
        type: 'move_sales_team',
        companyId: this.companyId,
        wardId: bestWard,
      };
    }

    return null;
  }

  // Find best ward for strategy based on preference function
  private findBestWardForStrategy(preferenceFunc: (ward: any) => number): WardId | null {
    const wardIds: WardId[] = ['shibuya', 'shinjuku', 'minato', 'chiyoda', 'koto'];
    let bestWard: WardId | null = null;
    let bestScore = -Infinity;

    wardIds.forEach((wardId) => {
      const ward = this.state.wards[wardId];
      const wardShare = this.state.wardShares[wardId];
      const currentShare = wardShare.shares[this.companyId];

      // Score based on preference and current weakness
      const preferenceScore = preferenceFunc(ward);
      const weaknessScore = 100 - currentShare; // Lower share = higher score
      const score = preferenceScore * 0.6 + weaknessScore * 0.4;

      if (score > bestScore) {
        bestScore = score;
        bestWard = wardId;
      }
    });

    return bestWard;
  }

  // Find wards where company is weak
  private findWeakWards(): WardId[] {
    const wardIds: WardId[] = ['shibuya', 'shinjuku', 'minato', 'chiyoda', 'koto'];
    return wardIds.filter((wardId) => {
      const share = this.state.wardShares[wardId].shares[this.companyId];
      return share < 20;
    });
  }

  // Calculate company strength (0-100)
  getCompanyStrength(): number {
    const company = this.state.companies[this.companyId];
    const totalShare = Object.values(this.state.wardShares).reduce((sum, wardShare) => {
      return sum + wardShare.shares[this.companyId];
    }, 0);
    const avgShare = totalShare / Object.keys(this.state.wards).length;

    // Strength = average share + cash factor + brand factor
    const cashFactor = Math.min(company.cash / 1000000, 20);
    const brandFactor = company.brand * 0.2;

    return Math.min(100, avgShare + cashFactor + brandFactor);
  }
}

// Execute AI actions for all companies except player
export function executeAITurns(state: GameState, playerCompanyId: CompanyId): void {
  const companyIds: CompanyId[] = ['kinoko', 'zeroten', 'dogpunk', 'dadaslip'];

  companyIds.forEach((companyId) => {
    if (companyId !== playerCompanyId) {
      const ai = new AIStrategy(state, companyId);
      const action = ai.getNextAction();

      if (action) {
        // Execute action (simplified - in real game would use game engine)
        executeAIAction(state, action);
      }
    }
  });
}

// Execute AI action
function executeAIAction(state: GameState, action: GameAction): void {
  const company = state.companies[action.companyId];

  switch (action.type) {
    case 'place_base_station':
      if (action.wardId && company.cash >= 50000) {
        company.cash -= 50000;
        company.baseStations += 1;
        const wardShare = state.wardShares[action.wardId];
        wardShare.shares[action.companyId] += 2;
      }
      break;

    case 'move_sales_team':
      if (action.wardId && company.cash >= 30000) {
        company.cash -= 30000;
        const wardShare = state.wardShares[action.wardId];
        wardShare.shares[action.companyId] += 1.5;
      }
      break;

    case 'run_advertising':
      if (action.wardId && company.cash >= (action.data?.amount || 50000)) {
        const amount = action.data?.amount || 50000;
        company.cash -= amount;
        company.brand = Math.min(company.brand + 2, 100);
        const wardShare = state.wardShares[action.wardId];
        wardShare.shares[action.companyId] += (amount / 100000) * 2;
      }
      break;
  }
}
