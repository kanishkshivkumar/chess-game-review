import { type NextRequest, NextResponse } from "next/server";
import { Chess } from "chess.js";

const TCN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{-";

function decodeTcnSquare(char: string): string | null {
  const index = TCN_CHARS.indexOf(char);
  if (index === -1) return null;
  const file = String.fromCharCode(97 + (index % 8));
  const rank = Math.floor(index / 8) + 1;
  return `${file}${rank}`;
}

function decodeTcnToPgn(tcn: string, headers: Record<string, string>): string {
  const chess = new Chess();

  // Set headers
  for (const [key, value] of Object.entries(headers)) {
    if (value && typeof value === "string") {
      try {
        chess.header(key, value);
      } catch {
        // ignore invalid header key
      }
    }
  }

  let i = 0;
  while (i < tcn.length) {
    const char1 = tcn[i];
    const char2 = tcn[i + 1];

    if (!char1 || !char2) break;

    const from = decodeTcnSquare(char1);
    const to = decodeTcnSquare(char2);

    if (from && to) {
      let promotion: string | undefined = undefined;
      const nextChar = tcn[i + 2];
      if (nextChar === "q" || nextChar === "r" || nextChar === "b" || nextChar === "n") {
        promotion = nextChar;
        i += 1;
      }

      try {
        const move = chess.move({ from, to, promotion });
        if (!move) {
          i += 1;
          continue;
        }
      } catch {
        i += 1;
        continue;
      }
      i += 2;
    } else {
      i += 1;
    }
  }

  return chess.pgn();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawInput = searchParams.get("url") || searchParams.get("id");

  if (!rawInput) {
    return NextResponse.json({ error: "Missing game URL or ID." }, { status: 400 });
  }

  // Extract ID from any Chess.com URL
  const trimmed = rawInput.trim();
  const idMatch =
    trimmed.match(/(?:chess\.com\/(?:[^\/]+\/)?(?:game|live)\/(?:live|daily)?\/?|^)(\d{8,12})/i) ||
    trimmed.match(/(\d{8,12})/);

  if (!idMatch) {
    return NextResponse.json(
      { error: "Could not parse a valid 8-12 digit Chess.com Game ID from the link." },
      { status: 400 },
    );
  }

  const gameId = idMatch[1];
  const endpoints = [
    `https://www.chess.com/callback/live/game/${gameId}`,
    `https://www.chess.com/callback/daily/game/${gameId}`,
  ];

  let gameJson: any = null;

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
        },
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.game) {
          gameJson = data.game;
          break;
        }
      }
    } catch {
      // try next endpoint
    }
  }

  if (!gameJson) {
    return NextResponse.json(
      { error: `Could not load Chess.com game #${gameId}. Please make sure the link is a valid completed Chess.com game.` },
      { status: 444 },
    );
  }

  const headers = gameJson.pgnHeaders || {};
  const whiteName = headers.White || gameJson.white?.username || "White";
  const blackName = headers.Black || gameJson.black?.username || "Black";
  const resultStr = headers.Result || (gameJson.colorOfWinner === "white" ? "1-0" : gameJson.colorOfWinner === "black" ? "0-1" : "1/2-1/2");

  let pgn = "";
  if (gameJson.pgn) {
    pgn = gameJson.pgn;
  } else if (gameJson.moveList) {
    pgn = decodeTcnToPgn(gameJson.moveList, {
      White: whiteName,
      Black: blackName,
      Result: resultStr,
      Event: headers.Event || "Chess.com Game",
    });
  }

  if (!pgn) {
    return NextResponse.json({ error: "Game moves could not be extracted from Chess.com response." }, { status: 422 });
  }

  return NextResponse.json({
    id: String(gameId),
    url: `https://www.chess.com/game/live/${gameId}`,
    pgn,
    white: { username: whiteName, rating: headers.WhiteElo },
    black: { username: blackName, rating: headers.BlackElo },
    result: resultStr,
  });
}
