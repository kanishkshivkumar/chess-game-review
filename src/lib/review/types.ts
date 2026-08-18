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

export interface GenericReviewItem {
  id: string;
  stepIndex: number;
  title: string;
  subtitle: string;
  classification: MoveClassification | "neutral";
  classificationTone: "best" | "good" | "inaccuracy" | "mistake" | "blunder" | "neutral";
  explanation: string;
  metadata?: Record<string, string>;
}

export interface ClassificationBreakdown {
  best: number;
  good: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
  total: number;
}

export interface GameSummary {
  whiteBreakdown: ClassificationBreakdown;
  blackBreakdown: ClassificationBreakdown;
  accuracyEstimate: {
    white: number;
    black: number;
  };
}

