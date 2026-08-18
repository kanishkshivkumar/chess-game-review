import { Chess } from "chess.js";

import type { ReviewFrame, ReviewGameSeed, ReviewMove, ReviewTimeline } from "./types";

export function buildReviewTimeline(game: ReviewGameSeed): ReviewTimeline {
  const chess = new Chess();
  const frames: ReviewFrame[] = [{ ply: 0, fen: chess.fen() }];
  const moves: ReviewMove[] = [];

  game.moves.forEach((moveSeed, index) => {
    const result = chess.move(moveSeed.san);

    if (!result) {
      throw new Error(`Illegal move at ply ${index + 1}: ${moveSeed.san}`);
    }

    const ply = index + 1;
    const side = index % 2 === 0 ? "white" : "black";
    const moveNumber = Math.floor(index / 2) + 1;
    const fen = chess.fen();

    moves.push({
      ...moveSeed,
      ply,
      side,
      moveNumber,
      fen,
      from: result.from,
      to: result.to,
    });

    frames.push({
      ply,
      fen,
      lastMove: {
        from: result.from,
        to: result.to,
      },
    });
  });

  return {
    game,
    frames,
    moves,
  };
}
