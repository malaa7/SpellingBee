import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import { GameState, Difficulty, Player } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [playerConfig, setPlayerConfig] = useState<{name: string, difficulty: Difficulty} | null>(null);
  const [finalPlayerStats, setFinalPlayerStats] = useState<Player | null>(null);

  const handleStart = (name: string, difficulty: Difficulty) => {
    setPlayerConfig({ name, difficulty });
    setGameState(GameState.PLAYING);
  };

  const handleEndGame = (score: number, time: number) => {
    if (playerConfig) {
      setFinalPlayerStats({
        name: playerConfig.name,
        difficulty: playerConfig.difficulty,
        score,
        time,
        date: new Date().toISOString()
      });
      setGameState(GameState.ENDED);
    }
  };

  const handleRestart = () => {
    setGameState(GameState.START);
    setPlayerConfig(null);
    setFinalPlayerStats(null);
  };

  return (
    <div className="antialiased font-sans text-right" dir="rtl">
      {gameState === GameState.START && (
        <StartScreen onStart={handleStart} />
      )}
      
      {gameState === GameState.PLAYING && playerConfig && (
        <GameScreen 
          difficulty={playerConfig.difficulty} 
          playerName={playerConfig.name}
          onEndGame={handleEndGame}
          onExit={handleRestart}
        />
      )}
      
      {gameState === GameState.ENDED && finalPlayerStats && (
        <EndScreen 
          currentPlayer={finalPlayerStats}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
};

export default App;