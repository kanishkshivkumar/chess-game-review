import React from "react";
import type { BoardPiece } from "@/lib/review/board";

interface ChessPieceProps {
  piece: BoardPiece;
  className?: string;
}

export function ChessPiece({ piece, className = "" }: ChessPieceProps) {
  const isWhite = piece.color === "w";
  const pieceLabel = `${isWhite ? "White" : "Black"} ${piece.type.toUpperCase()}`;

  const renderPiecePath = () => {
    switch (piece.type) {
      case "p":
        return (
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03C15.41 27.09 11 31.58 11 39.5h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={isWhite ? "#ffffff" : "#000000"}
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        );

      case "r":
        return (
          <g
            fill={isWhite ? "#ffffff" : "#000000"}
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 32l2-12h19l2 12H11zM12 20v-4h21v4H12zM9 16l3-3h21l3 3H9zM10 13V9h4v3h5V9h7v3h5V9h4v4H10z"
              strokeLinejoin="miter"
            />
            <path d="M12 20h21M13 32h19M11 36h23" stroke={isWhite ? "#000000" : "#ffffff"} />
          </g>
        );

      case "n":
        return (
          <g
            fill={isWhite ? "#ffffff" : "#000000"}
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 C 23,11 15,11 15,11 C 15,11 21,10 22,10 z" />
            <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,8.5 C 14.5,9.5 16.5,9.5 17.5,8.5 C 18.5,9.5 20.5,9.5 21.5,8.5 C 21.5,8.5 21.67,9.522 22,10 z" />
            <circle cx="9.5" cy="25.5" r="1.5" fill={isWhite ? "#000000" : "#ffffff"} />
            <path
              d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z"
              transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
              fill={isWhite ? "#000000" : "#ffffff"}
            />
          </g>
        );

      case "b":
        return (
          <g
            fill={isWhite ? "#ffffff" : "#000000"}
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 36c1.2-2.5 7-4 13.5-4 6.5 0 12.3 1.5 13.5 4H9z" />
            <path d="M15 32c2.5-2.5 4.5-6 4.5-10.5C19.5 17 21 13 22.5 10c1.5 3 3 7 3 11.5 0 4.5 2 8 4.5 10.5H15z" />
            <circle cx="22.5" cy="8.5" r="2.5" />
            <path d="M17.5 26h10M22.5 21v10" stroke={isWhite ? "#000000" : "#ffffff"} strokeWidth="1.5" />
          </g>
        );

      case "q":
        return (
          <g
            fill={isWhite ? "#ffffff" : "#000000"}
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="6" cy="12" r="2" />
            <circle cx="14" cy="9" r="2" />
            <circle cx="22.5" cy="8" r="2" />
            <circle cx="31" cy="9" r="2" />
            <circle cx="39" cy="12" r="2" />
            <path
              d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1.1 4 1.5 6h20c.4-2 .5-4.5 1.5-6 1-2 2.5-2 2.5-4 0-1.5-1.5-2.5-3-2.5-1.5 0-3 2.5-4 2.5s-2-3.5-3-3.5-2 3.5-3 3.5-1.5-3.5-2.5-3.5-2 3.5-3 3.5-2-2.5-4-2.5c-1.5 0-3 1-3 2.5z"
              strokeLinejoin="miter"
            />
            <path d="M11 36h23" />
            <path
              d="M11 14l3.5 11M16.5 11l2 14M22.5 10v15M28.5 11l-2 14M34 14l-3.5 11"
              stroke={isWhite ? "#000000" : "#ffffff"}
            />
          </g>
        );

      case "k":
        return (
          <g
            fill={isWhite ? "#ffffff" : "#000000"}
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22.5 11.63V6M20 8h5" stroke={isWhite ? "#000000" : "#ffffff"} strokeWidth="1.5" />
            <path
              d="M22.5 25c-4 0-7-1.5-7-4 0-2.5 3-4 7-4s7 1.5 7 4c0 2.5-3 4-7 4z"
              strokeLinejoin="miter"
            />
            <path d="M11.5 37c0-4 4.5-6 11-6s11 2 11 6h-22z" strokeLinejoin="miter" />
            <path d="M11.5 30c0-2.5 3-4 11-4s11 1.5 11 4" strokeLinejoin="miter" />
            <path d="M22.5 12c-4.5 0-8 3.5-8 8.5 0 2.5 1.5 4.5 3 6.5h10c1.5-2 3-4 3-6.5 0-5-3.5-8.5-8-8.5z" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 45 45"
      className={`chess-piece ${className}`}
      aria-label={pieceLabel}
      role="img"
    >
      {renderPiecePath()}
    </svg>
  );
}
