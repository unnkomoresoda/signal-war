import React from 'react';
import { Company } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CompanyPanelProps {
  company: Company;
}

export default function CompanyPanel({ company }: CompanyPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">資金</div>
              <div className="text-2xl font-bold">¥{(company.cash / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">基地局</div>
              <div className="text-2xl font-bold">{company.baseStations}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>ブランド指標</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">ブランド価値</span>
                <span className="text-sm font-semibold">{company.brand}%</span>
              </div>
              <Progress value={company.brand} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-400">評判</span>
                <span className="text-sm font-semibold">{company.reputation}%</span>
              </div>
              <Progress value={company.reputation} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm">特徴</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300">{company.description}</p>
          <div className="mt-4 p-3 bg-slate-700 rounded">
            <div className="text-xs text-slate-400">得意分野</div>
            <div className="font-semibold capitalize">{company.specialty}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
