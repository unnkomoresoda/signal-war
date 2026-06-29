import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4">PROJECT SIGNAL WAR</h1>
          <p className="text-2xl text-slate-300 mb-2">23区モバイル戦国時代</p>
          <p className="text-lg text-slate-400">人を奪え。街を制せ。電波で天下統一。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">ゲームコンセプト</h2>
            <p className="text-slate-300 mb-4">
              プレイヤーは携帯会社のCEOとなり、東京都23区を舞台に契約者を奪い合います。
            </p>
            <p className="text-slate-400 text-sm">
              戦争ではなく、営業、技術、広告、ブランド、SNS、基地局で日本一を目指します。
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">ゲームの特徴</h2>
            <ul className="text-slate-300 space-y-2">
              <li>✓ 住民シミュレーション</li>
              <li>✓ 企業戦略シミュレーション</li>
              <li>✓ 複数の勝利条件</li>
              <li>✓ ランダムイベント</li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">登場企業</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-600/20 rounded border border-blue-500">
              <div className="font-bold">kinoko</div>
              <div className="text-sm text-slate-400">通信品質最強</div>
            </div>
            <div className="p-4 bg-red-600/20 rounded border border-red-500">
              <div className="font-bold">ZEROTEN</div>
              <div className="text-sm text-slate-400">価格破壊</div>
            </div>
            <div className="p-4 bg-pink-600/20 rounded border border-pink-500">
              <div className="font-bold">ドッグパンク</div>
              <div className="text-sm text-slate-400">SNS最強</div>
            </div>
            <div className="p-4 bg-amber-600/20 rounded border border-amber-500">
              <div className="font-bold">ダダ滑りCM</div>
              <div className="text-sm text-slate-400">広告最強</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => setLocation("/game")}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
          >
            ゲーム開始
          </Button>
        </div>
      </div>
    </div>
  );
}
