import https from "https";

function fetchCallback(gameId) {
  const url = `https://www.chess.com/callback/live/game/${gameId}`;
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }, (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.game, null, 2));
    });
  }).on("error", console.error);
}

fetchCallback("97872578329");
