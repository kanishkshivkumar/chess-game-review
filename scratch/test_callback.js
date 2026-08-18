import https from "https";

function fetchCallback(gameId) {
  const url = `https://www.chess.com/callback/live/game/${gameId}`;
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      try {
        const json = JSON.parse(data);
        console.log("Game ID:", gameId);
        console.log("Keys in json.game:", Object.keys(json.game || {}));
        if (json.game?.pgnHeaders) {
          console.log("PGN Headers:", json.game.pgnHeaders);
        }
        if (json.game?.moveList) {
          console.log("moveList sample:", json.game.moveList.slice(0, 100));
        }
      } catch (err) {
        console.error("Failed to parse JSON:", err.message);
      }
    });
  }).on("error", console.error);
}

fetchCallback("97872578329");
