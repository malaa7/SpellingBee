export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Player {
  name: string;
  score: number;
  time: number;
  difficulty: Difficulty;
  date: string;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface GridCell {
  letter: string;
  id: string; // unique identifier "row-col"
  isFound: boolean; // Part of a word already found
  isHighlight: boolean; // Currently being dragged over
  isError: boolean; // Wrong selection animation
}

export interface WordConfig {
  word: string;
  found: boolean;
}

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  ENDED = 'ENDED'
}
