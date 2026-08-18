export type BoardPieceType = "p" | "r" | "n" | "b" | "q" | "k";
export type BoardPieceColor = "w" | "b";

export interface BoardPiece {
  type: BoardPieceType;
  color: BoardPieceColor;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

const PIECE_GLYPHS: Record<BoardPieceType, Record<BoardPieceColor, string>> = {
  p: { w: "♙", b: "♟" },
  r: { w: "♖", b: "♜" },
  n: { w: "♘", b: "♞" },
  b: { w: "♗", b: "♝" },
  q: { w: "♕", b: "♛" },
  k: { w: "♔", b: "♚" },
};

export function getPieceGlyph(piece: BoardPiece): string {
  return PIECE_GLYPHS[piece.type][piece.color];
}

export function getBoardPieceMap(fen: string): Record<string, BoardPiece> {
  const placement = fen.split(" ")[0];
  const rows = placement.split("/");

  if (rows.length !== 8) {
    throw new Error(`Invalid FEN placement: ${fen}`);
  }

  const pieces: Record<string, BoardPiece> = {};

  rows.forEach((row, rowIndex) => {
    const rank = 8 - rowIndex;
    let fileIndex = 0;

    for (const token of row) {
      const emptySquares = Number(token);

      if (Number.isInteger(emptySquares) && emptySquares > 0) {
        fileIndex += emptySquares;
        continue;
      }

      const color: BoardPieceColor = token === token.toUpperCase() ? "w" : "b";
      const type = token.toLowerCase() as BoardPieceType;
      const square = `${FILES[fileIndex]}${rank}`;

      pieces[square] = {
        type,
        color,
      };

      fileIndex += 1;
    }
  });

  return pieces;
}
