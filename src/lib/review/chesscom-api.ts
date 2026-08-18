import { Chess } from "chess.js";
import type { MoveClassification, ReviewGameSeed, ReviewMoveSeed } from "./types";

export interface ChessComGameData {
  url?: string;
  pgn: string;
  white: { username: string; rating?: number; result?: string };
  black: { username: string; rating?: number; result?: string };
  timeControl?: string;
  timeClass?: string;
}

export function parseChessComUrl(input: string): { type: "live" | "daily"; id: string } | null {
  const trimmed = input.trim();
  const idMatch =
    trimmed.match(/(?:chess\.com\/(?:[^\/]+\/)?(?:game|live)\/(?:live|daily)?\/?|^)(\d{8,12})/i) ||
    trimmed.match(/(\d{8,12})/);

  if (idMatch) {
    return { type: "live", id: idMatch[1] };
  }
  return null;
}

export async function fetchChessComGame(urlOrId: string): Promise<ChessComGameData> {
  const encoded = encodeURIComponent(urlOrId.trim());
  const res = await fetch(`/api/chesscom?url=${encoded}`);

  if (!res.ok) {
    let errorMsg = "Could not fetch game from Chess.com.";
    try {
      const errJson = await res.json();
      if (errJson.error) errorMsg = errJson.error;
    } catch {
      // fallback
    }
    throw new Error(errorMsg);
  }

  const json = await res.json();
  return {
    url: json.url,
    pgn: json.pgn,
    white: {
      username: json.white?.username ?? "White",
      rating: json.white?.rating,
    },
    black: {
      username: json.black?.username ?? "Black",
      rating: json.black?.rating,
    },
  };
}

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export function analyzePgnToReviewGame(
  pgn: string,
  meta?: { title?: string; white?: string; black?: string; result?: string; opening?: string },
): ReviewGameSeed {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    throw new Error("Invalid PGN format. Could not parse chess moves.");
  }

  const history = chess.history({ verbose: true });
  if (history.length === 0) {
    throw new Error("No moves found in game.");
  }

  // Extract headers
  const headerMap = chess.header();
  const whiteName = meta?.white ?? headerMap["White"] ?? "White";
  const blackName = meta?.black ?? headerMap["Black"] ?? "Black";
  const resultStr = meta?.result ?? headerMap["Result"] ?? "*";
  const openingStr = meta?.opening ?? headerMap["ECO"] ?? headerMap["Event"] ?? "Standard Game";
  const titleStr = meta?.title ?? `${whiteName} vs ${blackName}`;

  // Analyze move by move with heuristic engine
  const sim = new Chess();
  const moves: ReviewMoveSeed[] = [];
  let currentEval = 0;

  history.forEach((moveObj, index) => {
    const result = sim.move({
      from: moveObj.from,
      to: moveObj.to,
      promotion: moveObj.promotion,
    });
    if (!result) return;

    const isWhite = index % 2 === 0;
    const isCheck = sim.inCheck();
    const isMate = sim.isGameOver() && isCheck;
    const isCapture = Boolean(result.captured);
    const capturedVal = result.captured ? PIECE_VALUES[result.captured] ?? 0 : 0;

    // Calculate heuristic eval delta
    let delta = 0;
    if (isCapture) {
      delta += isWhite ? capturedVal * 0.8 : -capturedVal * 0.8;
    }

    if (isCheck) {
      delta += isWhite ? 0.6 : -0.6;
    }

    if (isMate) {
      delta += isWhite ? 100 : -100;
    }

    // Early queen output penalty
    if (index < 6 && result.piece === "q") {
      delta += isWhite ? -0.5 : 0.5;
    }

    // Center pawn push bonus
    if (
      index < 10 &&
      result.piece === "p" &&
      (result.to === "e4" || result.to === "d4" || result.to === "e5" || result.to === "d5")
    ) {
      delta += isWhite ? 0.3 : -0.3;
    }

    currentEval += delta;

    let classification: MoveClassification = "good";
    let category = "Opening Principle";
    let explanation = "";

    const moveNum = Math.floor(index / 2) + 1;
    const sideName = isWhite ? whiteName : blackName;

    if (isMate) {
      classification = "best";
      category = "Finishing Tactic";
      explanation = `Checkmate! ${sideName} delivers checkmate on ${result.to} with ${result.san}.`;
    } else if (isCapture && capturedVal >= 3) {
      classification = "best";
      category = "Finishing Tactic";
      explanation = `${sideName} executes a strong tactical capture with ${result.san}, winning material.`;
    } else if (isCheck) {
      classification = "best";
      category = "Tactical Trap Alert";
      explanation = `${sideName} puts the opponent king in check with ${result.san}, forcing defensive action.`;
    } else if (index < 8 && (result.piece === "n" || result.piece === "b")) {
      classification = "best";
      category = "Opening Principle";
      explanation = `Active development: ${sideName} brings a minor piece into the game with ${result.san}.`;
    } else if (index < 8 && result.piece === "q") {
      classification = "inaccuracy";
      category = "Tactical Trap Alert";
      explanation = `Early queen sortie with ${result.san}: developing the queen too early exposes it to enemy attacks.`;
    } else if (Math.abs(delta) > 2.5 && ((isWhite && delta < 0) || (!isWhite && delta > 0))) {
      classification = "blunder";
      category = "Tactical Trap Alert";
      explanation = `Blunder on move ${moveNum}: ${result.san} allows severe counter-tactics or material loss.`;
    } else if (Math.abs(delta) > 1.2 && ((isWhite && delta < 0) || (!isWhite && delta > 0))) {
      classification = "mistake";
      category = "Defensive Priority";
      explanation = `Mistake: ${result.san} cedes initiative or weakens key squares.`;
    } else {
      classification = "good";
      category = index < 12 ? "Opening Principle" : "Defensive Priority";
      explanation = `${sideName} plays ${result.san}, maintaining balance and spatial control.`;
    }

    moves.push({
      san: result.san,
      classification,
      explanation,
      evalScore: Number(currentEval.toFixed(1)),
      isMate,
      learningCategory: category,
    });
  });

  return {
    id: `custom-${Date.now()}`,
    title: titleStr,
    white: whiteName,
    black: blackName,
    result: resultStr,
    opening: openingStr,
    narrative: `Imported review for ${titleStr} (${moves.length} plies analyzed on-the-spot).`,
    moves,
  };
}
