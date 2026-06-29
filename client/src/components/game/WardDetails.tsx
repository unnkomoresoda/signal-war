import React from 'react';
import { Ward, WardShare } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getCompanyName, getCompanyColor } from '@/lib/gameData';
import { CompanyId } from '@/types/game';

interface WardDetailsProps {
  ward: Ward;
  wardShare: WardShare;
}

export default function WardDetails({ ward, wardShare }: WardDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>{ward.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-slate-400">人口</div>
              <div className="text-xl font-bold">{(ward.population / 1000).toFixed(0)}万人</div>
            </div>
            <div>
              <div className="text-sm text-slate-400">所得水準</div>
              <div className="text-lg font-semibold capitalize">{ward.income}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-sm">人口構成</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">若者率</span>
              <span className="font-semibold">{ward.youngRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">高齢者率</span>
              <span className="font-semibold">{ward.elderlyRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">法人率</span>
              <span className="font-semibold">{ward.corporateRate}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">住民嗜好</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>SNS感度</span>
                <span>{ward.snsSensitivity}%</span>
              </div>
              <Progress value={ward.snsSensitivity} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>ブランド志向</span>
                <span>{ward.brandOrientation}%</span>
              </div>
              <Progress value={ward.brandOrientation} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>価格重視</span>
                <span>{ward.priceOrientation}%</span>
              </div>
              <Progress value={ward.priceOrientation} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>通信品質重視</span>
                <span>{ward.qualityOrientation}%</span>
              </div>
              <Progress value={ward.qualityOrientation} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">シェア分布</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(Object.entries(wardShare.shares) as [CompanyId, number][])
              .sort((a, b) => b[1] - a[1])
              .map(([company, share]) => (
                <div key={company}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{getCompanyName(company)}</span>
                    <span className="font-semibold">{share.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${share}%`,
                        backgroundColor: getCompanyColor(company),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
