import React, { useEffect, useState } from 'react';
import { Player } from '../types';
import { Trophy, RefreshCcw, Star, Frown, ThumbsUp, Medal } from 'lucide-react';
import { WORDS_PER_GAME, SCORES } from '../constants';

interface Props {
  currentPlayer: Player;
  onRestart: () => void;
}

const EndScreen: React.FC<Props> = ({ currentPlayer, onRestart }) => {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);

  useEffect(() => {
    // Load existing
    const stored = localStorage.getItem('spelling-bee-leaderboard');
    let players: Player[] = stored ? JSON.parse(stored) : [];
    
    // Add current
    players.push(currentPlayer);
    
    // Sort: High score desc, then Low time asc
    players.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.time - b.time;
    });

    // Keep top 10
    players = players.slice(0, 10);

    // Save
    localStorage.setItem('spelling-bee-leaderboard', JSON.stringify(players));
    setLeaderboard(players);
  }, [currentPlayer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate Result Message
  const maxScore = WORDS_PER_GAME * SCORES.WORD_FOUND;
  const percentage = Math.round((currentPlayer.score / maxScore) * 100);

  let resultConfig = {
    title: '',
    subtitle: '',
    color: '',
    icon: <Trophy size={64} className="text-white" />,
    bgIcon: ''
  };

  if (percentage === 100) {
    resultConfig = {
      title: 'ممتاز يا بطل!',
      subtitle: 'لقد أكملت جميع الكلمات بنجاح دون أخطاء!',
      color: 'bg-green-500',
      bgIcon: 'bg-green-100',
      icon: <Trophy size={64} className="text-green-600" />
    };
  } else if (percentage >= 80) {
    resultConfig = {
      title: 'عمل رائع!',
      subtitle: 'أنت قريب جداً من القمة، استمر!',
      color: 'bg-blue-500',
      bgIcon: 'bg-blue-100',
      icon: <Medal size={64} className="text-blue-600" />
    };
  } else if (percentage >= 50) {
    resultConfig = {
      title: 'جيد جداً!',
      subtitle: 'حاول مرة أخرى لتحقيق نتيجة أفضل.',
      color: 'bg-yellow-500',
      bgIcon: 'bg-yellow-100',
      icon: <ThumbsUp size={64} className="text-yellow-600" />
    };
  } else {
    resultConfig = {
      title: 'بداية جيدة!',
      subtitle: 'لا تيأس، التدريب يصنع المعجزات.',
      color: 'bg-orange-500',
      bgIcon: 'bg-orange-100',
      icon: <Star size={64} className="text-orange-600" />
    };
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Success Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center border-b-4 border-gray-200">
          <div className={`inline-block p-4 rounded-full mb-4 animate-bounce ${resultConfig.bgIcon}`}>
            {resultConfig.icon}
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">{resultConfig.title}</h1>
          <p className="text-gray-500 mb-6">{resultConfig.subtitle}</p>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center p-3 bg-blue-50 rounded-xl min-w-[100px]">
              <span className="block text-sm text-gray-500 mb-1">النتيجة</span>
              <span className="block text-3xl font-bold text-blue-600">{currentPlayer.score}</span>
              <span className="text-xs text-gray-400">من {maxScore}</span>
            </div>
             <div className="text-center p-3 bg-blue-50 rounded-xl min-w-[100px]">
              <span className="block text-sm text-gray-500 mb-1">الوقت</span>
              <span className="block text-3xl font-bold text-blue-600">{formatTime(currentPlayer.time)}</span>
            </div>
          </div>

          <button 
            onClick={onRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto transform hover:scale-105"
          >
            <RefreshCcw size={20} />
            لعبة جديدة
          </button>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-4">
            <Trophy size={24} className="text-yellow-500" />
            لوحة الشرف (أفضل النتائج)
          </h2>
          
          <div className="space-y-3">
            {leaderboard.map((player, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                    player.date === currentPlayer.date && player.name === currentPlayer.name && player.time === currentPlayer.time
                    ? 'bg-blue-50 border border-blue-200 ring-2 ring-blue-100' 
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`
                    w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-sm
                    ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : 
                      idx === 1 ? 'bg-gray-300 text-gray-800' :
                      idx === 2 ? 'bg-orange-300 text-orange-900' : 'bg-white text-gray-500 border'}
                  `}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">{player.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        player.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                        player.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {player.difficulty === 'easy' ? 'سهل' : player.difficulty === 'medium' ? 'متوسط' : 'صعب'}
                      </span>
                      <span>•</span>
                      <span>{new Date(player.date).toLocaleDateString('ar-EG')}</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-left">
                  <div className="font-bold text-green-600">{player.score} نقطة</div>
                  <div className="text-xs text-gray-400 font-mono">{formatTime(player.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-xs">
            <p className="font-bold mb-1">مصمم اللعبة بالذكاء الاصطناعي : محمد علاء</p>
            <p>والد أحد طلاب معهد عبد الحليم محمود</p>
        </div>

      </div>
    </div>
  );
};

export default EndScreen;