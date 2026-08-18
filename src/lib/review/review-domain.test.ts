import assert from "node:assert/strict";
import test from "node:test";

import { reviewTimeline } from "./demo-game";
import { clampPly, goToNextPly, goToPreviousPly, formatPlyLabel } from "./navigation";
import { getReviewSnapshot } from "./selectors";

test("builds a synchronized review timeline", () => {
  assert.equal(reviewTimeline.moves.length, 14);
  assert.equal(reviewTimeline.frames.length, 15);

  const finalMove = reviewTimeline.moves.at(-1);
  assert.ok(finalMove);
  assert.equal(finalMove?.san, "Nf3#");
  assert.equal(finalMove?.ply, 14);
  assert.equal(reviewTimeline.frames[14].lastMove?.from, "d4");
  assert.equal(reviewTimeline.frames[14].lastMove?.to, "f3");
});

test("clamps navigation within the review range", () => {
  assert.equal(clampPly(-12, 14), 0);
  assert.equal(clampPly(6.9, 14), 6);
  assert.equal(clampPly(42, 14), 14);
  assert.equal(goToPreviousPly(0), 0);
  assert.equal(goToPreviousPly(8), 7);
  assert.equal(goToNextPly(13, 14), 14);
  assert.equal(goToNextPly(14, 14), 14);
});

test("selects the current move and exposes boundary flags", () => {
  const snapshot = getReviewSnapshot(reviewTimeline, 7);

  assert.equal(snapshot.ply, 7);
  assert.equal(snapshot.totalPlies, 14);
  assert.equal(snapshot.move?.san, "Nxe5");
  assert.equal(snapshot.move?.moveNumber, 4);
  assert.equal(snapshot.move?.side, "white");
  assert.equal(snapshot.canGoPrevious, true);
  assert.equal(snapshot.canGoNext, true);
});

test("formats ply labels for the navigation shell", () => {
  assert.equal(formatPlyLabel(0), "Start position");
  assert.equal(formatPlyLabel(1), "Move 1.");
  assert.equal(formatPlyLabel(2), "Move 1...");
  assert.equal(formatPlyLabel(7), "Move 4.");
});
