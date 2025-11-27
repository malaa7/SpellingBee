import React, { useState, useEffect } from 'react';
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

  // --- SEO & Document Head Management ---
  useEffect(() => {
    // Dynamic Title
    document.title = `${t.appTitle} - ${t.appSubtitle}`;
    
    // Dynamic Lang Attribute
    document.documentElement.lang = language;
    document.documentElement.dir = dir;

    // Dynamic Meta Description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t.metaDescription);
    }

    // JSON-LD Structured Data (Game/SoftwareApplication)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Spelling Bee Game",
      "applicationCategory": "EducationalGame",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": t.metaDescription,
      "inLanguage": language,
      "author": {
        "@type": "Person",
        "name": "Mohamed Alaa"
      }
    };

    // Inject Schema
    let scriptTag = document.getElementById('json-ld-schema') as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'json-ld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);

  }, [language, t, dir]);

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