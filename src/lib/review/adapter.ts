import type {
  ClassificationBreakdown,
  GameSummary,
  GenericReviewItem,
  MoveClassification,
  ReviewMove,
  ReviewTimeline,
} from "./types";

export function toGenericReviewItem(move?: ReviewMove): GenericReviewItem {
  if (!move) {
    return {
      id: "start-position",
      stepIndex: 0,
      title: "Initial Position",
      subtitle: "White to move",
      classification: "neutral",
      classificationTone: "neutral",
      explanation: "Use the navigation buttons or move list to step into the review.",
    };
  }

  return {
    id: `ply-${move.ply}`,
    stepIndex: move.ply,
    title: move.san,
    subtitle: `Move ${move.moveNumber}${move.side === "white" ? "." : "..."} ${move.side.toUpperCase()} move`,
    classification: move.classification,
    classificationTone: move.classification,
    explanation: move.explanation,
    metadata: {
      from: move.from,
      to: move.to,
      fen: move.fen,
      side: move.side,
    },
  };
}

const CLASSIFICATION_WEIGHTS: Record<MoveClassification, number> = {
  best: 100,
  good: 85,
  inaccuracy: 60,
  mistake: 35,
  blunder: 10,
};

function emptyBreakdown(): ClassificationBreakdown {
  return {
    best: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
    total: 0,
  };
}

export function calculateGameSummary(timeline: ReviewTimeline): GameSummary {
  const whiteBreakdown = emptyBreakdown();
  const blackBreakdown = emptyBreakdown();

  let whiteScoreTotal = 0;
  let blackScoreTotal = 0;

  for (const move of timeline.moves) {
    const target = move.side === "white" ? whiteBreakdown : blackBreakdown;
    target[move.classification] += 1;
    target.total += 1;

    const weight = CLASSIFICATION_WEIGHTS[move.classification];
    if (move.side === "white") {
      whiteScoreTotal += weight;
    } else {
      blackScoreTotal += weight;
    }
  }

  const whiteAccuracy =
    whiteBreakdown.total > 0 ? Math.round((whiteScoreTotal / (whiteBreakdown.total * 100)) * 100) : 100;
  const blackAccuracy =
    blackBreakdown.total > 0 ? Math.round((blackScoreTotal / (blackBreakdown.total * 100)) * 100) : 100;

  return {
    whiteBreakdown,
    blackBreakdown,
    accuracyEstimate: {
      white: whiteAccuracy,
      black: blackAccuracy,
    },
  };
}
