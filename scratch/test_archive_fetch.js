import https from "https";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on("error", reject);
  });
}

async function getExactPgnForGameId(gameId) {
  // 1. Fetch game callback metadata
  const callbackUrl = `https://www.chess.com/callback/live/game/${gameId}`;
  const callbackJson = await fetchJson(callbackUrl);
  
  const whiteUser = callbackJson.players?.bottom?.username || callbackJson.players?.top?.username || callbackJson.game?.pgnHeaders?.White;
  const endTime = callbackJson.game?.endTime;

  console.log("Game ID:", gameId);
  console.log("Player:", whiteUser);
  console.log("End Time:", endTime);

  if (!whiteUser || !endTime) {
    throw new Error("Could not extract player or timestamp from game metadata.");
  }

  const date = new Date(endTime * 1000);
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");

  const archiveUrl = `https://api.chess.com/pub/player/${whiteUser.toLowerCase()}/games/${yyyy}/${mm}`;
  console.log("Fetching archive:", archiveUrl);
  const archiveJson = await fetchJson(archiveUrl);

  const matchedGame = archiveJson.games?.find(g => g.url.includes(String(gameId)));
  if (matchedGame) {
    console.log("\n=== FOUND EXACT MATCHED PGN ===");
    console.log("White:", matchedGame.white.username);
    console.log("Black:", matchedGame.black.username);
    console.log("PGN Snippet:\n", matchedGame.pgn.slice(0, 300));
    return matchedGame;
  } else {
    console.log("Game not found in month archive.");
  }
}

getExactPgnForGameId("97872578329");
