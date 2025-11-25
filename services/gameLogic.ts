import { Difficulty, GridCell } from '../types';
import { EASY_WORDS, MEDIUM_WORDS, HARD_WORDS, GRID_SIZE, WORDS_PER_GAME } from '../constants';

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const getWordsForLevel = (difficulty: Difficulty): string[] => {
  let source = [];
  switch (difficulty) {
    case 'medium': source = MEDIUM_WORDS; break;
    case 'hard': source = HARD_WORDS; break;
    case 'easy': default: source = EASY_WORDS; break;
  }
  
  // Shuffle and pick subset
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, WORDS_PER_GAME).map(w => w.toUpperCase());
};

export const generateGrid = (difficulty: Difficulty, words: string[]): GridCell[][] => {
  const size = GRID_SIZE[difficulty];
  
  // Initialize empty grid
  const grid: GridCell[][] = Array(size).fill(null).map((_, row) => 
    Array(size).fill(null).map((_, col) => ({
      letter: '',
      id: `${row}-${col}`,
      isFound: false,
      isHighlight: false,
      isError: false
    }))
  );

  // Place words
  // Sort words by length descending to place larger items first
  const wordsToPlace = [...words].sort((a, b) => b.length - a.length);

  for (const word of wordsToPlace) {
    placeWordInGrid(grid, word, size);
  }

  // Fill empty spaces
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c].letter === '') {
        grid[r][c].letter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return grid;
};

const placeWordInGrid = (grid: GridCell[][], word: string, size: number) => {
  const directions = [
    [0, 1],   // Horizontal
    [1, 0],   // Vertical
    [1, 1],   // Diagonal Down-Right
    [1, -1]   // Diagonal Down-Left
  ];

  let placed = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!placed && attempts < maxAttempts) {
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (canPlaceWord(grid, word, row, col, dir[0], dir[1], size)) {
      for (let i = 0; i < word.length; i++) {
        grid[row + i * dir[0]][col + i * dir[1]].letter = word[i];
      }
      placed = true;
    }
    attempts++;
  }
};

const canPlaceWord = (grid: GridCell[][], word: string, row: number, col: number, dRow: number, dCol: number, size: number) => {
  // Check bounds
  if (row + dRow * (word.length - 1) < 0 || row + dRow * (word.length - 1) >= size) return false;
  if (col + dCol * (word.length - 1) < 0 || col + dCol * (word.length - 1) >= size) return false;

  // Check collisions
  for (let i = 0; i < word.length; i++) {
    const cell = grid[row + i * dRow][col + i * dCol];
    if (cell.letter !== '' && cell.letter !== word[i]) {
      return false;
    }
  }
  return true;
};
