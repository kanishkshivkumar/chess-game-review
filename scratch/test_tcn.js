import { Chess } from "chess.js";

const TCN_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789{-";

function decodeTcnSquare(char) {
  const index = TCN_CHARS.indexOf(char);
  if (index === -1) return null;
  const file = String.fromCharCode(97 + (index % 8)); // 'a' + file
  const rank = Math.floor(index / 8) + 1; // 1-8
  return `${file}${rank}`;
}

function decodeTcnToMoves(tcn) {
  const chess = new Chess();
  const moves = [];

  let i = 0;
  while (i < tcn.length) {
    const char1 = tcn[i];
    const char2 = tcn[i + 1];

    if (!char1 || !char2) break;

    const from = decodeTcnSquare(char1);
    const to = decodeTcnSquare(char2);

    if (from && to) {
      // Check for promotion (optional 3rd char in TCN)
      let promotion = undefined;
      const nextChar = tcn[i + 2];
      if (nextChar === "q" || nextChar === "r" || nextChar === "b" || nextChar === "n") {
        promotion = nextChar;
        i += 1;
      }

      try {
        const move = chess.move({ from, to, promotion });
        if (move) {
          moves.push(move.san);
        }
      } catch (err) {
        // Skip unknown modifier
      }
      i += 2;
    } else {
      i += 1;
    }
  }

  return { pgn: chess.pgn(), moves };
}

const sampleTcn = "mCYIbs2UnD92gv5QfAQGAmZReg!Tde8!ltGQeFQBvBIBsb0Sbl6Zlv46mdTNFn7PCKRKDK1Lfe97nBPBvB29Bv9IgfZQvM78dNUNMx!1ksQHxD67fm8!cuI0adXPmnNFtBHQsAQCBJSJKS18AJ0RowRDuD7JdcJIcIPIecFwDw80cI0SIY!7wD3NYW7tWOS0DM01OqtlMl";
const result = decodeTcnToMoves(sampleTcn);

console.log("Decoded moves count:", result.moves.length);
console.log("First 10 moves:", result.moves.slice(0, 10).join(" "));
console.log("Generated PGN preview:\n", result.pgn.slice(0, 200));
