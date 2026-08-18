import https from "https";

const urls = [
  "https://www.chess.com/game/export/pgn/97872578329",
  "https://www.chess.com/callback/live/game/97872578329",
  "https://api.chess.com/pub/game/live/97872578329",
];

function check(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(`Length: ${data.length}`);
          console.log(`Preview: ${data.slice(0, 300)}`);
        }
        resolve();
      });
    }).on("error", console.error);
  });
}

async function main() {
  for (const url of urls) {
    await check(url);
  }
}

main();
