import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pieceKeys = ["wP", "bP", "wN", "bN", "wB", "bB", "wR", "bR", "wQ", "bQ", "wK", "bK"];

const targetDir = path.join(__dirname, "../public/pieces");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(name) {
  const url = `https://raw.githubusercontent.com/lichess-org/lila/master/public/piece/cburnett/${name}.svg`;
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(targetDir, `${name}.svg`));
    https
      .get(url, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            console.log(`Downloaded ${name}.svg cleanly from GitHub raw`);
            resolve();
          });
        } else {
          file.close();
          reject(new Error(`Failed ${name} with status ${response.statusCode}`));
        }
      })
      .on("error", (err) => {
        fs.unlink(path.join(targetDir, `${name}.svg`), () => {});
        reject(err);
      });
  });
}

async function main() {
  for (const name of pieceKeys) {
    await download(name);
  }
}

main().catch(console.error);
