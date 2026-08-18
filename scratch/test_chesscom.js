import https from "https";

const urls = [
  "https://api.chess.com/pub/game/live/108573212879",
  "https://api.chess.com/pub/game/108573212879",
  "https://www.chess.com/callback/live/game/108573212879",
];

function check(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (res.statusCode === 200) {
          console.log(`Response preview: ${data.slice(0, 200)}`);
        }
        resolve();
      });
    }).on("error", (err) => {
      console.log(`URL: ${url} -> Error: ${err.message}`);
      resolve();
    });
  });
}

async function main() {
  for (const url of urls) {
    await check(url);
  }
}

main();
