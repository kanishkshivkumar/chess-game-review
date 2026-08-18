import https from "https";

const urls = [
  "https://api.chess.com/pub/game/live/97872578329",
  "https://api.chess.com/pub/game/live/97950132781",
  "https://www.chess.com/callback/live/game/97872578329",
];

function check(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" } }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(`Response length: ${data.length}`);
          console.log(`Response preview: ${data.slice(0, 250)}`);
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
