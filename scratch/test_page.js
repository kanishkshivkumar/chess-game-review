import https from "https";

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const matches = data.match(/game\s*:\s*\{[\s\S]*?\}/g) || data.match(/moves\s*:\s*\[[\s\S]*?\]/g) || data.match(/pgn[\s\S]*?[\r\n]/gi);
        console.log(`Found ${matches ? matches.length : 0} matches`);
        if (matches) {
          matches.slice(0, 5).forEach((m, i) => console.log(`Match ${i}: ${m.slice(0, 200)}`));
        }

        // Also search for callback / API URLs mentioned in the HTML
        const apiMatches = data.match(/https:\/\/[^"' ]+(?:callback|game|api)[^"' ]+/gi);
        if (apiMatches) {
          console.log("Found API/Callback URLs in HTML:");
          apiMatches.slice(0, 10).forEach(u => console.log(" - " + u));
        }
        resolve();
      });
    }).on("error", console.error);
  });
}

fetchPage("https://www.chess.com/game/live/108573212879");
