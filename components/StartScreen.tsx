import React, { useState } from 'react';
import { Difficulty, Language } from '../types';
import { BookOpen, Star, Trophy, Globe } from 'lucide-react';

interface Props {
  onStart: (name: string, difficulty: Difficulty) => void;
  language: Language;
  onLanguageToggle: () => void;
  t: any;
}

const StartScreen: React.FC<Props> = ({ onStart, language, onLanguageToggle, t }) => {
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name, difficulty);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100 relative">
      
      <button 
        onClick={onLanguageToggle}
        className="absolute top-4 right-4 rtl:left-4 rtl:right-auto bg-white p-2 rounded-full shadow-md text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 font-bold px-4"
      >
        <Globe size={20} />
        <span>{language === 'ar' ? 'English' : 'العربية'}</span>
      </button>

      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border-t-4 border-blue-600">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-blue-100 rounded-full">
              <BookOpen size={48} className="text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-1 font-sans">{t.appTitle}</h1>
          <h2 className="text-xl font-bold text-blue-600 mb-2">{t.appSubtitle}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.enterName}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder={t.placeholderName}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t.difficulty}</label>
            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => setDifficulty('easy')}
                className={`relative p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  difficulty === 'easy' 
                    ? 'border-green-500 bg-green-50 text-green-700' 
                    : 'border-gray-200 hover:border-green-300 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star size={20} className={difficulty === 'easy' ? 'fill-green-500 text-green-500' : ''} />
                  <span className="font-bold">{t.diffEasy}</span>
                </div>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md shadow-sm">{t.diffEasyDesc}</span>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('medium')}
                className={`relative p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  difficulty === 'medium' 
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700' 
                    : 'border-gray-200 hover:border-yellow-300 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex">
                    <Star size={20} className={difficulty === 'medium' ? 'fill-yellow-500 text-yellow-500' : ''} />
                    <Star size={20} className={difficulty === 'medium' ? 'fill-yellow-500 text-yellow-500' : ''} />
                  </div>
                  <span className="font-bold">{t.diffMedium}</span>
                </div>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md shadow-sm">{t.diffMediumDesc}</span>
              </button>

              <button
                type="button"
                onClick={() => setDifficulty('hard')}
                className={`relative p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  difficulty === 'hard' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-gray-200 hover:border-red-300 text-gray-600'
                }`}
              >
                 <div className="flex items-center gap-3">
                  <div className="flex">
                    <Star size={20} className={difficulty === 'hard' ? 'fill-red-500 text-red-500' : ''} />
                    <Star size={20} className={difficulty === 'hard' ? 'fill-red-500 text-red-500' : ''} />
                    <Star size={20} className={difficulty === 'hard' ? 'fill-red-500 text-red-500' : ''} />
                  </div>
                  <span className="font-bold">{t.diffHard}</span>
                </div>
                <span className="text-xs font-semibold bg-white px-2 py-1 rounded-md shadow-sm">{t.diffHardDesc}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-2"
          >
            <span>{t.startGame}</span>
            <Trophy size={20} />
          </button>
        </form>
        
        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
          <p className="font-bold">{t.designer}</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;