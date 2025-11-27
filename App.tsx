import React, { useState } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import { GameState, Difficulty, Player, Language } from './types';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [playerConfig, setPlayerConfig] = useState<{name: string, difficulty: Difficulty} | null>(null);
  const [finalPlayerStats, setFinalPlayerStats] = useState<Player | null>(null);
  const [language, setLanguage] = useState<Language>('ar');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

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

  const t = TRANSLATIONS[language];
  const dir = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <div className="antialiased font-sans" dir={dir}>
      {gameState === GameState.START && (
        <StartScreen 
          onStart={handleStart} 
          language={language}
          onLanguageToggle={toggleLanguage}
          t={t}
        />
      )}
      
      {gameState === GameState.PLAYING && playerConfig && (
        <GameScreen 
          difficulty={playerConfig.difficulty} 
          playerName={playerConfig.name}
          onEndGame={handleEndGame}
          onExit={handleRestart}
          language={language}
          t={t}
        />
      )}
      
      {gameState === GameState.ENDED && finalPlayerStats && (
        <EndScreen 
          currentPlayer={finalPlayerStats}
          onRestart={handleRestart}
          language={language}
          t={t}
        />
      )}
    </div>
  );
};

export default App;