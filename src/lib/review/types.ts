export type MoveClassification =
  | "best"
  | "good"
  | "inaccuracy"
  | "mistake"
  | "blunder";

export type MoveSide = "white" | "black";

export interface ReviewMoveSeed {
  san: string;
  classification: MoveClassification;
  explanation: string;
}

export interface ReviewGameSeed {
  id: string;
  title: string;
  white: string;
  black: string;
  result: string;
  opening: string;
  narrative: string;
  moves: ReviewMoveSeed[];
}

export interface ReviewFrame {
  ply: number;
  fen: string;
  lastMove?: {
    from: string;
    to: string;
  };
}

export interface ReviewMove extends ReviewMoveSeed {
  ply: number;
  moveNumber: number;
  side: MoveSide;
  fen: string;
  from: string;
  to: string;
}

export interface ReviewTimeline {
  game: ReviewGameSeed;
  frames: ReviewFrame[];
  moves: ReviewMove[];
}
