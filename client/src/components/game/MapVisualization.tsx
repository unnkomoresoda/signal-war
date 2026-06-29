import React from 'react';
import { WardId, WardShare } from '@/types/game';
import { WARDS, getCompanyColor, getCompanyName } from '@/lib/gameData';
import { CompanyId } from '@/types/game';

interface MapVisualizationProps {
  wardShares: Record<WardId, WardShare>;
  selectedWard: WardId;
  onSelectWard: (wardId: WardId) => void;
}

export default function MapVisualization({ wardShares, selectedWard, onSelectWard }: MapVisualizationProps) {
  const wardIds: WardId[] = ['shibuya', 'shinjuku', 'minato', 'chiyoda', 'koto'];

  const getWardColor = (wardId: WardId): string => {
    const shares = wardShares[wardId].shares;
    let maxShare = 0;
    let maxCompany: CompanyId | null = null;

    (Object.entries(shares) as [CompanyId, number][]).forEach(([company, share]) => {
      if (share > maxShare) {
        maxShare = share;
        maxCompany = company;
      }
    });

    if (maxCompany && maxShare > 30) {
      return getCompanyColor(maxCompany);
    }

    return '#64748b'; // slate-500
  };

  const getDominantCompany = (wardId: WardId): CompanyId | null => {
    const shares = wardShares[wardId].shares;
    let maxShare = 0;
    let maxCompany: CompanyId | null = null;

    (Object.entries(shares) as [CompanyId, number][]).forEach(([company, share]) => {
      if (share > maxShare) {
        maxShare = share;
        maxCompany = company;
      }
    });

    return maxShare > 30 ? maxCompany : null;
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {wardIds.map((wardId) => {
        const dominant = getDominantCompany(wardId);
        const color = getWardColor(wardId);

        return (
          <div
            key={wardId}
            onClick={() => onSelectWard(wardId)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedWard === wardId ? 'ring-2 ring-white' : ''
            }`}
            style={{
              backgroundColor: color,
              opacity: selectedWard === wardId ? 1 : 0.7,
            }}
          >
            <div className="font-bold text-white text-sm mb-2">{WARDS[wardId].name}</div>
            <div className="text-xs text-white/80 mb-2">
              人口: {(WARDS[wardId].population / 1000).toFixed(0)}万
            </div>
            {dominant && (
              <div className="text-xs font-semibold text-white">
                {getCompanyName(dominant)}: {wardShares[wardId].shares[dominant].toFixed(1)}%
              </div>
            )}
            <div className="mt-2 text-xs text-white/70">
              {(Object.entries(wardShares[wardId].shares) as [CompanyId, number][])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 2)
                .map(([company, share]) => (
                  <div key={company}>
                    {getCompanyName(company)}: {share.toFixed(0)}%
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
