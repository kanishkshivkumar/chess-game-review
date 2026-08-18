import https from "https";

// Test with real game URL: https://www.chess.com/game/live/97872578329
const gameId = "97872578329";

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(`Length: ${data.length}`);
          if (data.includes("[Event ")) {
            console.log("SUCCESS! Found PGN:\n", data.slice(0, 300));
          } else {
            // Check for json pgn
            try {
              const json = JSON.parse(data);
              console.log("JSON keys:", Object.keys(json));
              if (json.pgn) {
                console.log("SUCCESS! Found json.pgn:\n", json.pgn.slice(0, 300));
              } else if (json.game?.pgn) {
                console.log("SUCCESS! Found json.game.pgn:\n", json.game.pgn.slice(0, 300));
              }
            } catch {
              console.log("Not JSON.");
            }
          }
        }
        resolve();
      });
    }).on("error", console.error);
  });
}

async function main() {
  await fetchUrl(`https://www.chess.com/callback/live/game/${gameId}`);
  await fetchUrl(`https://www.chess.com/service/game/${gameId}`);
  await fetchUrl(`https://www.chess.com/game/live/${gameId}`);
}

main();
