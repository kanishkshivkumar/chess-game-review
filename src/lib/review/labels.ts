import type { MoveClassification } from "./types";

const CLASSIFICATION_LABELS: Record<MoveClassification, string> = {
  best: "Best move",
  good: "Good move",
  inaccuracy: "Inaccuracy",
  mistake: "Mistake",
  blunder: "Blunder",
};

export function getClassificationLabel(classification: MoveClassification): string {
  return CLASSIFICATION_LABELS[classification];
}

export function getClassificationTone(classification: MoveClassification): string {
  return classification;
}
