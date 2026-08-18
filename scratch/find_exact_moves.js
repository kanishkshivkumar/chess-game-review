import https from "https";

function checkCallback(gameId) {
  return new Promise((resolve) => {
    https.get(`https://www.chess.com/callback/live/game/${gameId}`, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const json = JSON.parse(data);
        console.log("=== CALLBACK JSON ===");
        console.log("game.moveList:", json.game?.moveList);
        console.log("game.pgnHeaders:", json.game?.pgnHeaders);
        console.log("players:", json.players);
        resolve();
      });
    });
  });
}

function checkHtml(gameId) {
  return new Promise((resolve) => {
    https.get(`https://www.chess.com/game/live/${gameId}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log("=== HTML INSPECTION ===");
        // Look for any string containing e4 or Nf3 or moveList or pgn
        const matches = data.match(/"moveList":\s*"([^"]+)"/g) || data.match(/"pgn":\s*"([^"]+)"/g) || data.match(/"moves":\s*\[([^\]]+)\]/g);
        console.log("Matches in HTML:", matches);

        // Search for gameData or initialData or gameReview
        const gameDataMatches = data.match(/gameData\s*=\s*(\{[\s\S]*?\});/);
        if (gameDataMatches) {
          console.log("Found gameData script!");
        }

        // Search for hikaru / player names in script tags
        const pgnInScript = data.match(/\[Event\s+[\s\S]*?1-0|0-1|1\/2-1\/2/);
        if (pgnInScript) {
          console.log("Found raw PGN string in HTML:\n", pgnInScript[0].slice(0, 300));
        }

        resolve();
      });
    });
  });
}

async function main() {
  await checkCallback("97872578329");
  await checkHtml("97872578329");
}

main();
