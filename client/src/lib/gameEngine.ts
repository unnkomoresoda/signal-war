import { GameState, CompanyId, WardId, GameAction } from '@/types/game';
import { WARDS, COMPANIES } from './gameData';

// Game engine logic
export class GameEngine {
  private state: GameState;

  constructor(state: GameState) {
    this.state = state;
  }

  getState(): GameState {
    return this.state;
  }

  // Execute a game action
  executeAction(action: GameAction): void {
    switch (action.type) {
      case 'place_base_station':
        this.placeBaseStation(action.companyId, action.wardId!);
        break;
      case 'move_sales_team':
        this.moveSalesTeam(action.companyId, action.wardId!);
        break;
      case 'run_advertising':
        this.runAdvertising(action.companyId, action.wardId!, action.data?.amount || 50000);
        break;
      case 'change_pricing':
        this.changePricing(action.companyId, action.data?.priceLevel || 0);
        break;
      case 'end_turn':
        this.endTurn();
        break;
    }
  }

  // Place a base station in a ward
  private placeBaseStation(companyId: CompanyId, wardId: WardId): void {
    const company = this.state.companies[companyId];
    const cost = 50000; // 5万円

    if (company.cash < cost) {
      this.addLog(`${COMPANIES[companyId].name}: 資金不足`);
      return;
    }

    company.cash -= cost;
    company.baseStations += 1;

    // Improve quality perception in this ward
    const wardShare = this.state.wardShares[wardId];
    const currentShare = wardShare.shares[companyId];
    wardShare.shares[companyId] = Math.min(currentShare + 2, 100);

    this.addLog(`${COMPANIES[companyId].name}: ${WARDS[wardId].name}に基地局を設置`);
  }

  // Move sales team to a ward
  private moveSalesTeam(companyId: CompanyId, wardId: WardId): void {
    const company = this.state.companies[companyId];
    const cost = 30000; // 3万円

    if (company.cash < cost) {
      this.addLog(`${COMPANIES[companyId].name}: 資金不足`);
      return;
    }

    company.cash -= cost;

    // Gain contracts based on company specialty
    const ward = this.state.wards[wardId];
    const wardShare = this.state.wardShares[wardId];
    const specialty = COMPANIES[companyId].specialty;

    let shareGain = 1;
    if (specialty === 'quality' && ward.qualityOrientation > 70) shareGain = 3;
    if (specialty === 'price' && ward.priceOrientation > 70) shareGain = 3;
    if (specialty === 'sns' && ward.snsSensitivity > 70) shareGain = 3;
    if (specialty === 'advertising' && ward.brandOrientation > 70) shareGain = 3;

    const currentShare = wardShare.shares[companyId];
    wardShare.shares[companyId] = Math.min(currentShare + shareGain, 100);

    this.addLog(`${COMPANIES[companyId].name}: ${WARDS[wardId].name}で営業活動`);
  }

  // Run advertising campaign
  private runAdvertising(companyId: CompanyId, wardId: WardId, amount: number): void {
    const company = this.state.companies[companyId];

    if (company.cash < amount) {
      this.addLog(`${COMPANIES[companyId].name}: 資金不足`);
      return;
    }

    company.cash -= amount;

    // Advertising effectiveness
    const ward = this.state.wards[wardId];
    const wardShare = this.state.wardShares[wardId];
    const specialty = COMPANIES[companyId].specialty;

    let shareGain = (amount / 100000) * 2; // Base gain
    if (specialty === 'advertising') shareGain *= 1.5;

    const currentShare = wardShare.shares[companyId];
    wardShare.shares[companyId] = Math.min(currentShare + shareGain, 100);

    // Increase brand
    company.brand = Math.min(company.brand + 2, 100);

    this.addLog(`${COMPANIES[companyId].name}: ${WARDS[wardId].name}で広告キャンペーン（${amount}円）`);
  }

  // Change pricing strategy
  private changePricing(companyId: CompanyId, priceLevel: number): void {
    const company = this.state.companies[companyId];
    const specialty = COMPANIES[companyId].specialty;

    // Price level: -1 (cheap), 0 (normal), 1 (premium)
    if (specialty === 'price' && priceLevel === -1) {
      // Cheap pricing benefits
      Object.keys(this.state.wardShares).forEach((wardId) => {
        const wardShare = this.state.wardShares[wardId as WardId];
        const currentShare = wardShare.shares[companyId];
        wardShare.shares[companyId] = Math.min(currentShare + 1, 100);
      });
      this.addLog(`${COMPANIES[companyId].name}: 価格を引き下げ`);
    }
  }

  // End turn and calculate changes
  private endTurn(): void {
    this.state.turn += 1;
    this.state.month += 1;

    if (this.state.month > 12) {
      this.state.month = 1;
      this.state.year += 1;
    }

    // Normalize shares (ensure they sum to 100)
    Object.keys(this.state.wardShares).forEach((wardId) => {
      const wardShare = this.state.wardShares[wardId as WardId];
      const total = Object.values(wardShare.shares).reduce((a, b) => a + b, 0);
      if (total !== 100) {
        const scale = 100 / total;
        Object.keys(wardShare.shares).forEach((companyId) => {
          wardShare.shares[companyId as CompanyId] = Math.round(wardShare.shares[companyId as CompanyId] * scale);
        });
      }
    });

    // Random events
    this.triggerRandomEvent();

    this.addLog(`ターン ${this.state.turn} 終了 (${this.state.year}年${this.state.month}月)`);
  }

  // Trigger random events
  private triggerRandomEvent(): void {
    const eventTypes = [
      'communication_failure',
      'celebrity_campaign',
      'regulation',
      'ai_service',
      'viral_moment',
    ];

    const random = Math.random();
    if (random > 0.7) {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const affectedCompany = Object.keys(this.state.companies)[Math.floor(Math.random() * 4)] as CompanyId;

      switch (eventType) {
        case 'communication_failure':
          this.state.companies[affectedCompany].reputation -= 10;
          this.addLog(`⚠️ ${COMPANIES[affectedCompany].name}: 通信障害が発生`);
          break;
        case 'celebrity_campaign':
          this.state.companies[affectedCompany].brand += 15;
          this.addLog(`✨ ${COMPANIES[affectedCompany].name}: 芸能人起用キャンペーン成功`);
          break;
        case 'regulation':
          this.addLog(`📋 総務省: 料金値下げ命令`);
          break;
        case 'ai_service':
          this.state.companies[affectedCompany].cash -= 100000;
          this.addLog(`🤖 ${COMPANIES[affectedCompany].name}: AI接客導入（-10万円）`);
          break;
      }
    }
  }

  // Add log entry
  private addLog(message: string): void {
    this.state.gameLog.push(message);
    if (this.state.gameLog.length > 50) {
      this.state.gameLog.shift();
    }
  }

  // Calculate total subscribers for each company
  getTotalShares(): Record<CompanyId, number> {
    const shares: Record<CompanyId, number> = {
      kinoko: 0,
      zeroten: 0,
      dogpunk: 0,
      dadaslip: 0,
    };

    Object.values(this.state.wardShares).forEach((wardShare) => {
      Object.entries(wardShare.shares).forEach(([companyId, share]) => {
        shares[companyId as CompanyId] += share;
      });
    });

    // Average
    Object.keys(shares).forEach((companyId) => {
      shares[companyId as CompanyId] /= Object.keys(this.state.wards).length;
    });

    return shares;
  }

  // Check win conditions
  checkWinConditions(): string | null {
    const totalShares = this.getTotalShares();

    // Check territory (50% in any ward)
    for (const [wardId, wardShare] of Object.entries(this.state.wardShares)) {
      const maxShare = Math.max(...Object.values(wardShare.shares));
      if (maxShare >= 50) {
        const winner = Object.entries(wardShare.shares).find(([_, share]) => share === maxShare)?.[0] as CompanyId;
        if (winner) {
          return `${COMPANIES[winner].name}: ${WARDS[wardId as WardId].name}を制圧`;
        }
      }
    }

    // Check overall share
    const maxShare = Math.max(...Object.values(totalShares));
    if (maxShare >= 40) {
      const winner = Object.entries(totalShares).find(([_, share]) => share === maxShare)?.[0] as CompanyId;
      if (winner) {
        return `${COMPANIES[winner].name}: 全体シェア40%以上達成`;
      }
    }

    return null;
  }
}
