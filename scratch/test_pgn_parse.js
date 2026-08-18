import { Chess } from "chess.js";

const samplePgn = `[Event "Live Chess"]
[Site "Chess.com"]
[Date "2024.01.01"]
[Round "-"]
[White "Hikaru"]
[Black "Gravity_Chess"]
[Result "1-0"]

1. e4 {[%clk 0:03:00]} 1... c5 {[%clk 0:03:00]} 2. Nc3 {[%clk 0:02:59.9]} 2... g6 {[%clk 0:02:57.5]} 3. f4 {[%clk 0:02:59.8]} 3... Bg7 {[%clk 0:02:56]} 4. Nf3 {[%clk 0:02:59.7]} 4... Nc6 {[%clk 0:02:55.6]} 5. Bc4 {[%clk 0:02:58.8]} 5... Na5 {[%clk 0:02:49.5]} 6. Be2 {[%clk 0:02:57]} 6... d6 {[%clk 0:02:46.9]} 7. O-O {[%clk 0:02:43.2]} 7... Nf6 {[%clk 0:02:46.3]} 8. Qe1 {[%clk 0:02:42.2]} 8... O-O {[%clk 0:02:43.6]} 9. d3 {[%clk 0:02:41.6]} 9... Nc6 {[%clk 0:02:42]} 10. Qh4 {[%clk 0:02:40.2]} 10... Nd4 {[%clk 0:02:20.8]} 1-0`;

const chess = new Chess();
try {
  chess.loadPgn(samplePgn);
  const moves = chess.history({ verbose: true });
  console.log("Parsed moves count:", moves.length);
  console.log("Moves:", moves.map(m => m.san).join(" "));
} catch (err) {
  console.error("Error parsing PGN:", err.message);
}
