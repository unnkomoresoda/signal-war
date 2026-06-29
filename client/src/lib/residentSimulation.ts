import { Resident, WardId, CompanyId } from '@/types/game';
import { WARDS, COMPANIES } from './gameData';

// Generate residents for a ward
export function generateResidents(wardId: WardId, count: number): Resident[] {
  const residents: Resident[] = [];
  const ward = WARDS[wardId];

  for (let i = 0; i < count; i++) {
    const resident: Resident = {
      id: `${wardId}-${i}`,
      wardId,
      workWardId: getRandomWorkWard(),
      age: Math.floor(Math.random() * 60) + 18,
      preference: getPreferenceByWard(ward),
      currentProvider: getRandomProvider(),
      satisfaction: Math.floor(Math.random() * 40) + 50,
      churnRisk: Math.floor(Math.random() * 30),
    };
    residents.push(resident);
  }

  return residents;
}

// Get random work ward
function getRandomWorkWard(): WardId {
  const wards: WardId[] = ['shibuya', 'shinjuku', 'minato', 'chiyoda', 'koto'];
  return wards[Math.floor(Math.random() * wards.length)];
}

// Get resident preference based on ward characteristics
function getPreferenceByWard(ward: any): 'quality' | 'price' | 'sns' | 'advertising' | 'brand' {
  const preferences: Array<'quality' | 'price' | 'sns' | 'advertising' | 'brand'> = [];

  if (ward.qualityOrientation > 70) preferences.push('quality');
  if (ward.priceOrientation > 70) preferences.push('price');
  if (ward.snsSensitivity > 70) preferences.push('sns');
  if (ward.brandOrientation > 70) preferences.push('brand');

  // If no strong preference, add advertising
  if (preferences.length === 0) preferences.push('advertising');

  return preferences[Math.floor(Math.random() * preferences.length)];
}

// Get random provider
function getRandomProvider(): CompanyId {
  const providers: CompanyId[] = ['kinoko', 'zeroten', 'dogpunk', 'dadaslip'];
  return providers[Math.floor(Math.random() * providers.length)];
}

// Simulate resident behavior
export function simulateResidentBehavior(
  resident: Resident,
  wardShares: Record<CompanyId, number>,
  companyQualities: Record<CompanyId, number>
): CompanyId | null {
  // Check if resident should churn
  if (resident.churnRisk > Math.random() * 100) {
    // Find best provider based on preference
    return findBestProvider(resident, wardShares, companyQualities);
  }

  return null; // No change
}

// Find best provider for resident
function findBestProvider(
  resident: Resident,
  wardShares: Record<CompanyId, number>,
  companyQualities: Record<CompanyId, number>
): CompanyId {
  const providers: CompanyId[] = ['kinoko', 'zeroten', 'dogpunk', 'dadaslip'];
  let bestProvider: CompanyId = resident.currentProvider || 'kinoko';
  let bestScore = -Infinity;

  providers.forEach((provider) => {
    let score = 0;

    // Preference matching
    const specialty = COMPANIES[provider].specialty;
    if (specialty === resident.preference) {
      score += 30;
    }

    // Market share (popular = good)
    score += (wardShares[provider] || 0) * 0.1;

    // Quality
    score += (companyQualities[provider] || 50) * 0.2;

    // Brand
    score += (COMPANIES[provider].brand || 50) * 0.1;

    if (score > bestScore) {
      bestScore = score;
      bestProvider = provider;
    }
  });

  return bestProvider;
}

// Update resident satisfaction
export function updateResidentSatisfaction(
  resident: Resident,
  companyQuality: number,
  companyReputation: number
): void {
  const qualityImpact = (companyQuality - 50) * 0.5;
  const reputationImpact = (companyReputation - 50) * 0.3;

  resident.satisfaction = Math.max(0, Math.min(100, resident.satisfaction + qualityImpact + reputationImpact));

  // Update churn risk based on satisfaction
  resident.churnRisk = Math.max(0, 100 - resident.satisfaction);
}

// Simulate word of mouth
export function simulateWordOfMouth(
  residents: Resident[],
  provider: CompanyId,
  reputation: number
): number {
  let shareChange = 0;

  residents.forEach((resident) => {
    if (resident.currentProvider === provider) {
      // Positive word of mouth if reputation is high
      if (reputation > 70 && Math.random() > 0.7) {
        shareChange += 0.1; // Small positive impact
      }
      // Negative word of mouth if reputation is low
      else if (reputation < 40 && Math.random() > 0.8) {
        shareChange -= 0.2; // Larger negative impact
      }
    }
  });

  return shareChange;
}

// Calculate churn rate
export function calculateChurnRate(residents: Resident[]): number {
  const churned = residents.filter((r) => r.churnRisk > 70).length;
  return (churned / residents.length) * 100;
}
