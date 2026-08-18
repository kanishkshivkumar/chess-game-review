import { type NextRequest, NextResponse } from "next/server";
import { Chess } from "chess.js";

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "BlankSage-Review-Replay/1.0 (contact@blanksage.com)",
      Accept: "application/json",
    },
    next: { revalidate: 3600 }, // Cache archives for 1 hr
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  return res.json();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawInput = searchParams.get("url") || searchParams.get("id");

  if (!rawInput) {
    return NextResponse.json({ error: "Missing game URL or ID." }, { status: 400 });
  }

  const trimmed = rawInput.trim();

  // If user pasted a full raw PGN directly into input
  if (trimmed.startsWith("[Event ") || trimmed.includes("1. e4") || trimmed.includes("1. d4")) {
    const chess = new Chess();
    try {
      chess.loadPgn(trimmed);
      const headerMap = chess.header();
      return NextResponse.json({
        id: `custom-${Date.now()}`,
        url: "",
        pgn: trimmed,
        white: { username: headerMap["White"] || "White" },
        black: { username: headerMap["Black"] || "Black" },
        result: headerMap["Result"] || "*",
      });
    } catch {
      // Continue URL parsing if PGN load fails
    }
  }

  // Extract numeric Game ID
  const idMatch =
    trimmed.match(/(?:chess\.com\/(?:[^\/]+\/)?(?:game|live)\/(?:live|daily)?\/?|^)(\d{8,12})/i) ||
    trimmed.match(/(\d{8,12})/);

  if (!idMatch) {
    return NextResponse.json(
      { error: "Could not parse a valid Chess.com Game ID from the link. Please check your link format." },
      { status: 400 },
    );
  }

  const gameId = idMatch[1];
  const endpoints = [
    `https://www.chess.com/callback/live/game/${gameId}`,
    `https://www.chess.com/callback/daily/game/${gameId}`,
  ];

  let callbackJson: any = null;

  for (const endpoint of endpoints) {
    try {
      callbackJson = await fetchJson(endpoint);
      if (callbackJson?.game || callbackJson?.players) {
        break;
      }
    } catch {
      // try next endpoint
    }
  }

  if (!callbackJson) {
    return NextResponse.json(
      { error: `Could not load Chess.com game #${gameId}. Please check that the game URL is correct.` },
      { status: 404 },
    );
  }

  // Extract players and timestamp from callback metadata
  const players = callbackJson.players || {};
  const game = callbackJson.game || {};
  const headers = game.pgnHeaders || {};

  const whiteUser =
    players.bottom?.color === "white"
      ? players.bottom?.username
      : players.top?.color === "white"
      ? players.top?.username
      : players.bottom?.username || headers.White || "white";

  const blackUser =
    players.bottom?.color === "black"
      ? players.bottom?.username
      : players.top?.color === "black"
      ? players.top?.username
      : players.top?.username || headers.Black || "black";

  const endTime = game.endTime || Math.floor(Date.now() / 1000);
  const dateObj = new Date(endTime * 1000);
  const yyyy = dateObj.getUTCFullYear();
  const mm = String(dateObj.getUTCMonth() + 1).padStart(2, "0");

  // Attempt 1: Fetch exact PGN from official Chess.com player monthly archive API
  if (whiteUser) {
    try {
      const archiveUrl = `https://api.chess.com/pub/player/${whiteUser.toLowerCase()}/games/${yyyy}/${mm}`;
      const archiveData = await fetchJson(archiveUrl);
      const matchedGame = archiveData.games?.find((g: any) => g.url && g.url.includes(String(gameId)));

      if (matchedGame && matchedGame.pgn) {
        return NextResponse.json({
          id: String(gameId),
          url: matchedGame.url || `https://www.chess.com/game/live/${gameId}`,
          pgn: matchedGame.pgn,
          white: { username: matchedGame.white?.username || whiteUser, rating: matchedGame.white?.rating },
          black: { username: matchedGame.black?.username || blackUser, rating: matchedGame.black?.rating },
          result: matchedGame.white?.result === "win" ? "1-0" : matchedGame.black?.result === "win" ? "0-1" : "1/2-1/2",
        });
      }
    } catch {
      // Archive fallback
    }
  }

  // Attempt 2: If archive search for White user failed, try Black user's archive
  if (blackUser) {
    try {
      const archiveUrl = `https://api.chess.com/pub/player/${blackUser.toLowerCase()}/games/${yyyy}/${mm}`;
      const archiveData = await fetchJson(archiveUrl);
      const matchedGame = archiveData.games?.find((g: any) => g.url && g.url.includes(String(gameId)));

      if (matchedGame && matchedGame.pgn) {
        return NextResponse.json({
          id: String(gameId),
          url: matchedGame.url || `https://www.chess.com/game/live/${gameId}`,
          pgn: matchedGame.pgn,
          white: { username: matchedGame.white?.username || whiteUser, rating: matchedGame.white?.rating },
          black: { username: matchedGame.black?.username || blackUser, rating: matchedGame.black?.rating },
          result: matchedGame.white?.result === "win" ? "1-0" : matchedGame.black?.result === "win" ? "0-1" : "1/2-1/2",
        });
      }
    } catch {
      // Fallthrough
    }
  }

  // Attempt 3: If PGN is present in game metadata directly
  if (game.pgn) {
    return NextResponse.json({
      id: String(gameId),
      url: `https://www.chess.com/game/live/${gameId}`,
      pgn: game.pgn,
      white: { username: whiteUser },
      black: { username: blackUser },
      result: headers.Result || "*",
    });
  }

  return NextResponse.json(
    { error: `Could not retrieve original game PGN for game #${gameId}. Please check the URL or paste the game PGN directly.` },
    { status: 422 },
  );
}
