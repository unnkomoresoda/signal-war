import React, { createContext, useContext, useState, useCallback } from 'react';
import { GameState, GameAction } from '@/types/game';
import { createInitialGameState } from '@/lib/gameData';
import { GameEngine } from '@/lib/gameEngine';

interface GameContextType {
  gameState: GameState;
  gameEngine: GameEngine;
  executeAction: (action: GameAction) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState());
  const [gameEngine] = useState(() => new GameEngine(gameState));

  const executeAction = useCallback((action: GameAction) => {
    gameEngine.executeAction(action);
    setGameState({ ...gameEngine.getState() });
  }, [gameEngine]);

  const resetGame = useCallback(() => {
    const newState = createInitialGameState();
    setGameState(newState);
  }, []);

  return (
    <GameContext.Provider value={{ gameState, gameEngine, executeAction, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
