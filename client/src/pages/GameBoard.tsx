import React, { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyId, WardId } from '@/types/game';
import { COMPANIES, WARDS, getCompanyColor, getCompanyName, getWardName } from '@/lib/gameData';
import MapVisualization from '@/components/game/MapVisualization';
import CompanyPanel from '@/components/game/CompanyPanel';
import WardDetails from '@/components/game/WardDetails';
import GameLog from '@/components/game/GameLog';

export default function GameBoard() {
  const { gameState, executeAction } = useGame();
  const [selectedWard, setSelectedWard] = useState<WardId>('shibuya');
  const [selectedCompany, setSelectedCompany] = useState<CompanyId>('kinoko');

  const handleEndTurn = () => {
    executeAction({ type: 'end_turn', companyId: selectedCompany });
  };

  const handlePlaceBaseStation = () => {
    executeAction({
      type: 'place_base_station',
      companyId: selectedCompany,
      wardId: selectedWard,
    });
  };

  const handleRunAdvertising = () => {
    executeAction({
      type: 'run_advertising',
      companyId: selectedCompany,
      wardId: selectedWard,
      data: { amount: 100000 },
    });
  };

  const handleMoveSalesTeam = () => {
    executeAction({
      type: 'move_sales_team',
      companyId: selectedCompany,
      wardId: selectedWard,
    });
  };

  // Calculate total shares
  const totalShares = Object.keys(gameState.companies).reduce((acc, companyId) => {
    const shares = Object.values(gameState.wardShares).reduce((sum, wardShare) => {
      return sum + (wardShare.shares[companyId as CompanyId] || 0);
    }, 0);
    acc[companyId as CompanyId] = shares / Object.keys(gameState.wards).length;
    return acc;
  }, {} as Record<CompanyId, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">PROJECT SIGNAL WAR</h1>
          <div className="flex justify-between items-center">
            <p className="text-lg text-slate-300">
              ターン {gameState.turn} | {gameState.year}年{gameState.month}月
            </p>
            <Button onClick={handleEndTurn} size="lg" className="bg-blue-600 hover:bg-blue-700">
              ターン終了
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>東京都23区</CardTitle>
              </CardHeader>
              <CardContent>
                <MapVisualization
                  wardShares={gameState.wardShares}
                  selectedWard={selectedWard}
                  onSelectWard={setSelectedWard}
                />
              </CardContent>
            </Card>
          </div>

          {/* Company Selector */}
          <div>
            <Card className="bg-slate-800 border-slate-700 mb-4">
              <CardHeader>
                <CardTitle>企業選択</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(Object.keys(gameState.companies) as CompanyId[]).map((companyId) => (
                    <Button
                      key={companyId}
                      onClick={() => setSelectedCompany(companyId)}
                      variant={selectedCompany === companyId ? 'default' : 'outline'}
                      className="w-full justify-start"
                      style={{
                        backgroundColor: selectedCompany === companyId ? getCompanyColor(companyId) : 'transparent',
                      }}
                    >
                      {getCompanyName(companyId)}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Global Shares */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-sm">全体シェア</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(Object.keys(totalShares) as CompanyId[]).map((companyId) => (
                    <div key={companyId} className="flex justify-between items-center">
                      <span className="text-sm">{getCompanyName(companyId)}</span>
                      <span className="font-bold">{totalShares[companyId].toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="company" className="mb-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="company">企業情報</TabsTrigger>
            <TabsTrigger value="ward">区情報</TabsTrigger>
            <TabsTrigger value="actions">アクション</TabsTrigger>
            <TabsTrigger value="log">ログ</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <CompanyPanel company={gameState.companies[selectedCompany]} />
          </TabsContent>

          <TabsContent value="ward">
            <WardDetails
              ward={gameState.wards[selectedWard]}
              wardShare={gameState.wardShares[selectedWard]}
            />
          </TabsContent>

          <TabsContent value="actions">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle>アクション</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handlePlaceBaseStation} className="bg-green-600 hover:bg-green-700">
                    基地局設置
                    <br />
                    <span className="text-xs">5万円</span>
                  </Button>
                  <Button onClick={handleMoveSalesTeam} className="bg-blue-600 hover:bg-blue-700">
                    営業活動
                    <br />
                    <span className="text-xs">3万円</span>
                  </Button>
                  <Button onClick={handleRunAdvertising} className="bg-purple-600 hover:bg-purple-700">
                    広告キャンペーン
                    <br />
                    <span className="text-xs">10万円</span>
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    料金変更
                    <br />
                    <span className="text-xs">無料</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="log">
            <GameLog logs={gameState.gameLog} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
