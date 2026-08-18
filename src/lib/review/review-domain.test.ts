import assert from "node:assert/strict";
import test from "node:test";

import { ALL_GAMES, DEFAULT_GAME_ID, getGameTimeline, operaGame, reviewTimeline, scholarsMateGame } from "./demo-game";
import { clampPly, formatPlyLabel, goToNextPly, goToPreviousPly } from "./navigation";
import { getReviewSnapshot } from "./selectors";
import { calculateGameSummary, toGenericReviewItem } from "./adapter";
import { getClassificationLabel, getClassificationSymbol } from "./labels";
import { getBoardPieceMap } from "./board";

test("builds a synchronized review timeline for default game", () => {
  assert.equal(reviewTimeline.moves.length, 14);
  assert.equal(reviewTimeline.frames.length, 15);

  const finalMove = reviewTimeline.moves.at(-1);
  assert.ok(finalMove);
  assert.equal(finalMove?.san, "Nf3#");
  assert.equal(finalMove?.ply, 14);
  assert.equal(reviewTimeline.frames[14].lastMove?.from, "d4");
  assert.equal(reviewTimeline.frames[14].lastMove?.to, "f3");
});

test("builds timelines for all registered games without errors", () => {
  assert.equal(ALL_GAMES.length, 3);

  const operaTimeline = getGameTimeline("opera-game");
  assert.equal(operaTimeline.moves.length, 33);
  assert.equal(operaTimeline.moves.at(-1)?.san, "Rd8#");

  const scholarsTimeline = getGameTimeline("scholars-mate");
  assert.equal(scholarsTimeline.moves.length, 7);
  assert.equal(scholarsTimeline.moves.at(-1)?.san, "Qxf7#");
});

test("handles game timeline lookup fallback for unknown IDs", () => {
  const defaultTimeline = getGameTimeline(null);
  assert.equal(defaultTimeline.game.id, DEFAULT_GAME_ID);

  const fallbackTimeline = getGameTimeline("non-existent-game-id");
  assert.equal(fallbackTimeline.game.id, DEFAULT_GAME_ID);
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

test("adapts chess moves into generic review items for BlankSage review shell", () => {
  const startItem = toGenericReviewItem(undefined);
  assert.equal(startItem.id, "start-position");
  assert.equal(startItem.stepIndex, 0);
  assert.equal(startItem.classification, "neutral");

  const snapshot = getReviewSnapshot(reviewTimeline, 7);
  const moveItem = toGenericReviewItem(snapshot.move);

  assert.equal(moveItem.id, "ply-7");
  assert.equal(moveItem.stepIndex, 7);
  assert.equal(moveItem.title, "Nxe5");
  assert.equal(moveItem.classification, "good");
  assert.equal(moveItem.metadata?.from, "f3");
  assert.equal(moveItem.metadata?.to, "e5");
});

test("calculates accuracy estimates and move classification breakdown", () => {
  const summary = calculateGameSummary(reviewTimeline);

  assert.ok(summary.accuracyEstimate.white > 0);
  assert.ok(summary.accuracyEstimate.black > 0);
  assert.equal(summary.whiteBreakdown.total, 7);
  assert.equal(summary.blackBreakdown.total, 7);
  assert.equal(summary.whiteBreakdown.best + summary.whiteBreakdown.good + summary.whiteBreakdown.mistake + summary.whiteBreakdown.blunder + summary.whiteBreakdown.inaccuracy, 7);
});

test("returns non-color classification symbols and descriptive labels", () => {
  assert.equal(getClassificationSymbol("best"), "BEST");
  assert.equal(getClassificationSymbol("blunder"), "??");
  assert.equal(getClassificationLabel("mistake"), "Mistake");
});


test("parses FEN string into board piece positions correctly", () => {
  const initialFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const pieceMap = getBoardPieceMap(initialFen);

  assert.equal(pieceMap["e1"].type, "k");
  assert.equal(pieceMap["e1"].color, "w");
  assert.equal(pieceMap["e8"].type, "k");
  assert.equal(pieceMap["e8"].color, "b");
  assert.equal(pieceMap["e4"], undefined);
});

import { analyzePgnToReviewGame, parseChessComUrl } from "./chesscom-api";

test("parses Chess.com game URLs accurately", () => {
  const parsed1 = parseChessComUrl("https://www.chess.com/game/live/108573212879");
  assert.deepEqual(parsed1, { type: "live", id: "108573212879" });

  const parsed2 = parseChessComUrl("https://www.chess.com/game/daily/987654321");
  assert.deepEqual(parsed2, { type: "live", id: "987654321" });

  const parsed3 = parseChessComUrl("https://www.chess.com/analysis/game/live/97872578329");
  assert.deepEqual(parsed3, { type: "live", id: "97872578329" });

  const parsed4 = parseChessComUrl("97872578329");
  assert.deepEqual(parsed4, { type: "live", id: "97872578329" });

  const parsed5 = parseChessComUrl("invalid-link");
  assert.equal(parsed5, null);
});


test("analyzes raw PGN into ReviewGameSeed with classifications and eval scores", () => {
  const samplePgn = "1. e4 e5 2. Nf3 Nc6 3. Bc4 Nd4 4. Nxe5 Qg5 5. Nxf7 Qxg2 6. Rf1 Qxe4+ 7. Be2 Nf3#";
  const analyzedGame = analyzePgnToReviewGame(samplePgn, {
    title: "Analyzed Test Game",
    white: "Player 1",
    black: "Player 2",
  });

  assert.equal(analyzedGame.moves.length, 14);
  assert.equal(analyzedGame.moves[0].san, "e4");
  assert.equal(analyzedGame.moves.at(-1)?.san, "Nf3#");
  assert.equal(analyzedGame.moves.at(-1)?.isMate, true);
  assert.ok(analyzedGame.moves[0].evalScore !== undefined);
});

