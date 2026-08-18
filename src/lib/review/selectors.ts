import { clampPly } from "./navigation";
import type { ReviewTimeline } from "./types";

export interface ReviewSnapshot {
  ply: number;
  totalPlies: number;
  frame: ReviewTimeline["frames"][number];
  move?: ReviewTimeline["moves"][number];
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function getReviewSnapshot(
  timeline: ReviewTimeline,
  requestedPly: number,
): ReviewSnapshot {
  const totalPlies = timeline.moves.length;
  const ply = clampPly(requestedPly, totalPlies);

  return {
    ply,
    totalPlies,
    frame: timeline.frames[ply] ?? timeline.frames[0],
    move: ply === 0 ? undefined : timeline.moves[ply - 1],
    canGoPrevious: ply > 0,
    canGoNext: ply < totalPlies,
  };
}
