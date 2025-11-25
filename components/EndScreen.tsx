import React, { useEffect, useState } from 'react';
import { Player, Difficulty } from '../types';
import { Trophy, RefreshCcw, User, Clock, Calendar } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        
        {/* Success Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center border-b-4 border-green-500">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4 animate-bounce">
            <Trophy size={64} className="text-green-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-2">ممتاز يا بطل!</h1>
          <p className="text-gray-500 mb-6">لقد أكملت جميع الكلمات بنجاح</p>
          
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <span className="block text-sm text-gray-400">النتيجة</span>
              <span className="block text-3xl font-bold text-blue-600">{currentPlayer.score}</span>
            </div>
             <div className="text-center">
              <span className="block text-sm text-gray-400">الوقت</span>
              <span className="block text-3xl font-bold text-blue-600">{formatTime(currentPlayer.time)}</span>
            </div>
          </div>

          <button 
            onClick={onRestart}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mx-auto"
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
                className={`flex items-center justify-between p-4 rounded-xl ${
                    player.date === currentPlayer.date && player.name === currentPlayer.name && player.time === currentPlayer.time
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`
                    w-8 h-8 flex items-center justify-center rounded-full font-bold
                    ${idx === 0 ? 'bg-yellow-400 text-yellow-900' : 
                      idx === 1 ? 'bg-gray-300 text-gray-800' :
                      idx === 2 ? 'bg-orange-300 text-orange-900' : 'bg-white text-gray-500 border'}
                  `}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-gray-800">{player.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span>{player.difficulty === 'easy' ? 'سهل' : player.difficulty === 'medium' ? 'متوسط' : 'صعب'}</span>
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