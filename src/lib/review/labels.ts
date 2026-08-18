import type { MoveClassification } from "./types";

const CLASSIFICATION_LABELS: Record<MoveClassification, string> = {
  best: "Best move",
  good: "Good move",
  inaccuracy: "Inaccuracy",
  mistake: "Mistake",
  blunder: "Blunder",
};

const CLASSIFICATION_SYMBOLS: Record<MoveClassification, string> = {
  best: "✓",
  good: "👍",
  inaccuracy: "?!",
  mistake: "?",
  blunder: "??",
};

export function getClassificationLabel(classification: MoveClassification): string {
  return CLASSIFICATION_LABELS[classification];
}

export function getClassificationSymbol(classification: MoveClassification): string {
  return CLASSIFICATION_SYMBOLS[classification];
}

export function getClassificationTone(classification: MoveClassification): string {
  return classification;
}

