import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, GridCell, WordConfig, CellPosition } from '../types';
import { getWordsForLevel, generateGrid } from '../services/gameLogic';
import { playCorrectSound, playErrorSound, playWinSound } from '../services/soundService';
import { WORDS_PER_GAME, SCORES } from '../constants';
import { Clock, RefreshCcw, Shuffle, Home, CheckCircle, Heart, HeartCrack } from 'lucide-react';

interface Props {
  difficulty: Difficulty;
  playerName: string;
  onEndGame: (score: number, timeElapsed: number) => void;
  onExit: () => void;
}

const GameScreen: React.FC<Props> = ({ difficulty, playerName, onEndGame, onExit }) => {
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [words, setWords] = useState<WordConfig[]>([]);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  
  // Selection state
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<CellPosition | null>(null);
  const [currentPos, setCurrentPos] = useState<CellPosition | null>(null);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  
  const gridRef = useRef<HTMLDivElement>(null);
  const endGameTriggered = useRef(false);

  // Initialize game logic
  const startNewRound = useCallback(() => {
    const gameWords = getWordsForLevel(difficulty);
    const newGrid = generateGrid(difficulty, gameWords);
    setGrid(newGrid);
    setWords(gameWords.map(w => ({ word: w, found: false })));
    setScore(0);
    setTimeElapsed(0);
    setMistakes(0);
    endGameTriggered.current = false;
    
    // Clear selection state
    setIsSelecting(false);
    setStartPos(null);
    setCurrentPos(null);
    setSelectedCells(new Set());
  }, [difficulty]);

  // Initial mount
  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (!endGameTriggered.current) {
        setTimeElapsed(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check end game (Win Condition)
  useEffect(() => {
    if (words.length > 0 && words.every(w => w.found) && !endGameTriggered.current) {
      endGameTriggered.current = true;
      playWinSound();
      setTimeout(() => {
        onEndGame(score, timeElapsed);
      }, 2000);
    }
  }, [words, score, timeElapsed, onEndGame]);

  // --- Interaction Logic ---

  const getCellFromTouch = (clientX: number, clientY: number): CellPosition | null => {
    if (!gridRef.current) return null;
    const elements = document.elementsFromPoint(clientX, clientY);
    for (const el of elements) {
      if (el.hasAttribute('data-row') && el.hasAttribute('data-col')) {
        return {
          row: parseInt(el.getAttribute('data-row')!),
          col: parseInt(el.getAttribute('data-col')!)
        };
      }
    }
    return null;
  };

  const calculateSelection = useCallback((start: CellPosition, end: CellPosition) => {
    const newSelected = new Set<string>();
    
    const dRow = end.row - start.row;
    const dCol = end.col - start.col;
    
    // Determine direction (Horizontal, Vertical, Diagonal)
    // We only allow perfect lines
    let stepRow = 0;
    let stepCol = 0;

    if (dRow === 0 && dCol !== 0) { // Horizontal
      stepCol = dCol > 0 ? 1 : -1;
    } else if (dCol === 0 && dRow !== 0) { // Vertical
      stepRow = dRow > 0 ? 1 : -1;
    } else if (Math.abs(dRow) === Math.abs(dCol)) { // Diagonal
      stepRow = dRow > 0 ? 1 : -1;
      stepCol = dCol > 0 ? 1 : -1;
    } else {
      // Invalid drag (not a straight line), just highlight start
      newSelected.add(`${start.row}-${start.col}`);
      return newSelected;
    }

    // Trace the line
    let r = start.row;
    let c = start.col;
    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));

    for (let i = 0; i <= steps; i++) {
      newSelected.add(`${r}-${c}`);
      r += stepRow;
      c += stepCol;
    }

    return newSelected;
  }, []);

  const handleStart = (row: number, col: number) => {
    if (endGameTriggered.current) return;
    setIsSelecting(true);
    const start = { row, col };
    setStartPos(start);
    setCurrentPos(start);
    setSelectedCells(new Set([`${row}-${col}`]));
  };

  const handleMove = (row: number, col: number) => {
    if (!isSelecting || !startPos || endGameTriggered.current) return;
    if (currentPos?.row === row && currentPos?.col === col) return; // Optimization

    setCurrentPos({ row, col });
    const selection = calculateSelection(startPos, { row, col });
    setSelectedCells(selection);
  };

  const handleEnd = () => {
    if (!isSelecting || !startPos || !currentPos || endGameTriggered.current) return;
    
    setIsSelecting(false);

    // Form word from selected cells
    let selectedWord = "";
    const selection = calculateSelection(startPos, currentPos);
    
    // Re-tracing logic simply to build string:
    const dRow = currentPos.row - startPos.row;
    const dCol = currentPos.col - startPos.col;
    let stepRow = 0;
    let stepCol = 0;
    if (dRow === 0 && dCol !== 0) stepCol = dCol > 0 ? 1 : -1;
    else if (dCol === 0 && dRow !== 0) stepRow = dRow > 0 ? 1 : -1;
    else if (Math.abs(dRow) === Math.abs(dCol)) { stepRow = dRow > 0 ? 1 : -1; stepCol = dCol > 0 ? 1 : -1; }
    else {
      // Invalid line
      setSelectedCells(new Set());
      setStartPos(null);
      setCurrentPos(null);
      return; 
    }

    const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
    const pathCoords: string[] = [];
    let r = startPos.row;
    let c = startPos.col;

    for (let i = 0; i <= steps; i++) {
        selectedWord += grid[r][c].letter;
        pathCoords.push(`${r}-${c}`);
        r += stepRow;
        c += stepCol;
    }

    // Check match
    const matchedWordIndex = words.findIndex(w => !w.found && w.word === selectedWord);
    
    if (matchedWordIndex !== -1) {
      // Success!
      playCorrectSound();
      const newScore = score + SCORES.WORD_FOUND;
      setScore(newScore);
      
      // Update Grid (mark found)
      setGrid(prev => prev.map((rowArr, rIdx) => 
        rowArr.map((cell, cIdx) => {
          if (pathCoords.includes(cell.id)) {
            return { ...cell, isFound: true };
          }
          return cell;
        })
      ));

      // Update Word List
      setWords(prev => prev.map((w, idx) => 
        idx === matchedWordIndex ? { ...w, found: true } : w
      ));

    } else {
      // Failure
      playErrorSound();
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);

      setGrid(prev => prev.map(rowArr => 
         rowArr.map(cell => {
             if (selection.has(cell.id)) return { ...cell, isError: true };
             return cell;
         })
      ));
      
      setTimeout(() => {
        setGrid(prev => prev.map(rowArr => 
            rowArr.map(cell => ({ ...cell, isError: false }))
         ));
      }, 500);

      // Check for Game Over based on mistakes
      const maxMistakes = words.length; // Allow mistakes equal to word count
      if (newMistakes >= maxMistakes) {
        endGameTriggered.current = true;
        setTimeout(() => {
          onEndGame(score, timeElapsed);
        }, 1000);
      }
    }

    // Cleanup
    setSelectedCells(new Set());
    setStartPos(null);
    setCurrentPos(null);
  };

  const handleFinishEarly = () => {
    if (endGameTriggered.current) return;
    endGameTriggered.current = true;
    if (score > 0) playWinSound();
    onEndGame(score, timeElapsed);
  };

  // Mouse Events
  const onMouseDown = (r: number, c: number) => handleStart(r, c);
  const onMouseEnter = (r: number, c: number) => handleMove(r, c);
  const onMouseUp = () => handleEnd();

  // Touch Events (Global handling for smooth drag)
  const onTouchStart = (e: React.TouchEvent) => {
    const pos = getCellFromTouch(e.touches[0].clientX, e.touches[0].clientY);
    if (pos) handleStart(pos.row, pos.col);
  };
  
  const onTouchMove = (e: React.TouchEvent) => {
    const pos = getCellFromTouch(e.touches[0].clientX, e.touches[0].clientY);
    if (pos) handleMove(pos.row, pos.col);
  };


  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const maxMistakes = words.length;
  const attemptsLeft = maxMistakes - mistakes;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row h-screen overflow-hidden" onMouseUp={onMouseUp}>
      
      {/* Sidebar (Top on mobile) */}
      <div className="w-full md:w-80 bg-white shadow-lg z-10 flex flex-col p-4 md:h-full overflow-y-auto shrink-0">
        <div className="mb-6 flex justify-between items-center md:block">
          <div>
            <h2 className="text-xl font-bold text-blue-800">أهلاً, {playerName}</h2>
            <p className="text-sm text-gray-500">المستوى: {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'صعب'}</p>
          </div>
          <div className="bg-blue-100 px-4 py-2 rounded-lg text-blue-800 font-bold flex items-center gap-2">
            <Clock size={18} />
            {formatTime(timeElapsed)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
           <div className="bg-green-50 p-3 rounded-xl border border-green-200 flex flex-col items-center justify-center">
              <span className="text-xs text-green-800 font-bold mb-1">النقاط</span>
              <span className="text-2xl font-black text-green-600">{score}</span>
          </div>
           <div className="bg-red-50 p-3 rounded-xl border border-red-200 flex flex-col items-center justify-center">
              <span className="text-xs text-red-800 font-bold mb-1 flex items-center gap-1">
                <Heart size={14} className="fill-red-500 text-red-500" />
                المحاولات
              </span>
              <span className="text-2xl font-black text-red-600">{Math.max(0, attemptsLeft)}</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-700 mb-3 border-b pb-2">الكلمات المطلوبة ({words.filter(w => w.found).length}/{WORDS_PER_GAME})</h3>
        <div className="grid grid-cols-3 md:grid-cols-2 gap-2 overflow-y-auto flex-1 content-start mb-4 max-h-[150px] md:max-h-none">
            {words.map((w, idx) => (
                <div 
                    key={idx} 
                    className={`text-xs md:text-sm p-2 rounded-md font-semibold text-center transition-all duration-300 ${
                        w.found 
                        ? 'bg-green-500 text-white shadow-sm scale-95 opacity-50 decoration-slice line-through' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {w.word}
                </div>
            ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={handleFinishEarly}
            className="w-full bg-green-100 hover:bg-green-200 text-green-900 font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors border border-green-200 shadow-sm"
          >
            <CheckCircle size={18} />
            انتهيت (حفظ النتيجة)
          </button>
          
          <div className="flex gap-2">
            <button 
              onClick={startNewRound}
              className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
            >
              <Shuffle size={16} />
              تغيير الكلمات
            </button>
            <button 
              onClick={onExit}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors"
            >
              <Home size={16} />
              لعبة جديدة
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 bg-blue-50 flex items-center justify-center p-2 md:p-8 overflow-hidden relative">
          
        <div 
          className="relative bg-white p-2 md:p-4 rounded-xl shadow-2xl select-none touch-none max-w-full max-h-full overflow-auto"
          ref={gridRef}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={handleEnd}
        >
          <div 
            className="grid gap-1"
            style={{ 
                gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
            }}
          >
            {grid.map((row, rIdx) => 
                row.map((cell, cIdx) => {
                    const isSelected = selectedCells.has(cell.id);
                    let bgColor = 'bg-white';
                    let textColor = 'text-gray-700';
                    let scale = 'scale-100';

                    if (cell.isFound) {
                        bgColor = 'bg-green-500';
                        textColor = 'text-white';
                    } else if (cell.isError) {
                        bgColor = 'bg-red-500';
                        textColor = 'text-white';
                    } else if (isSelected) {
                        bgColor = 'bg-blue-500';
                        textColor = 'text-white';
                        scale = 'scale-105';
                    }

                    return (
                        <div
                            key={cell.id}
                            data-row={rIdx}
                            data-col={cIdx}
                            onMouseDown={() => onMouseDown(rIdx, cIdx)}
                            onMouseEnter={() => onMouseEnter(rIdx, cIdx)}
                            className={`
                                w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12
                                flex items-center justify-center
                                text-sm sm:text-base md:text-xl font-bold rounded-md
                                cursor-pointer transition-all duration-150
                                border border-gray-100 shadow-sm
                                ${bgColor} ${textColor} ${scale}
                                ${cell.isError ? 'shake-animation' : ''}
                            `}
                        >
                            {cell.letter}
                        </div>
                    );
                })
            )}
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 text-gray-400 text-xs hidden md:block">
            قطاع المعاهد الأزهرية
        </div>
      </div>
    </div>
  );
};

export default GameScreen;