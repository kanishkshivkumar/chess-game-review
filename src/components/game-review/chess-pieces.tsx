import React from "react";
import type { BoardPiece } from "@/lib/review/board";

interface ChessPieceProps {
  piece: BoardPiece;
  className?: string;
}

export function ChessPiece({ piece, className = "" }: ChessPieceProps) {
  const pieceKey = `${piece.color}${piece.type.toUpperCase()}`;
  const pieceLabel = `${piece.color === "w" ? "White" : "Black"} ${piece.type.toUpperCase()}`;

  return (
    <img
      src={`/pieces/${pieceKey}.svg`}
      alt={pieceLabel}
      className={`chess-piece ${className}`}
      draggable={false}
    />
  );
}
