import React from "react";
import type { BoardPiece } from "@/lib/review/board";

interface ChessPieceProps {
  piece: BoardPiece;
  className?: string;
}

export function ChessPiece({ piece, className = "" }: ChessPieceProps) {
  const isWhite = piece.color === "w";
  const strokeColor = isWhite ? "#262626" : "#000000";
  const fillColor = isWhite ? "#ffffff" : "#2b2b2b";
  const highlightColor = isWhite ? "#f7f7f7" : "#404040";

  switch (piece.type) {
    case "p":
      return (
        <svg
          viewBox="0 0 45 45"
          className={`chess-piece ${className}`}
          aria-hidden="true"
          role="img"
        >
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.96 3.84 2.45 5.03C15.9 27.27 14 30.15 14 33.5h17c0-3.35-1.9-6.23-4.45-7.47C28.04 24.84 29 23.03 29 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {isWhite && (
            <path
              d="M22.5 10c-1.66 0-3 1.34-3 3 0 .67.22 1.28.59 1.78.14.19.29.37.45.54.49.52 1.17.88 1.96.88s1.47-.36 1.96-.88c.16-.17.31-.35.45-.54.37-.5.59-1.11.59-1.78 0-1.66-1.34-3-3-3z"
              fill={highlightColor}
              opacity="0.3"
            />
          )}
        </svg>
      );

    case "r":
      return (
        <svg
          viewBox="0 0 45 45"
          className={`chess-piece ${className}`}
          aria-hidden="true"
          role="img"
        >
          <g
            fill={fillColor}
            fillRule="evenodd"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M9 36v-3h27v3H9zM12 33v-9h21v9H12zM11 24l2-4h19l2 4H11zM14 20l-1-7h3v2h4v-2h5v2h4v-2h3l-1 7H14z"
              strokeLinejoin="miter"
            />
            <path d="M12 13.5h21" fill="none" stroke={strokeColor} strokeWidth="1" />
          </g>
        </svg>
      );

    case "n":
      return (
        <svg
          viewBox="0 0 45 45"
          className={`chess-piece ${className}`}
          aria-hidden="true"
          role="img"
        >
          <g
            fill={fillColor}
            fillRule="evenodd"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18 C 23,11 15,11 15,11 C 15,11 21,10 22,10 z" />
            <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,8.5 C 14.5,9.5 16.5,9.5 17.5,8.5 C 18.5,9.5 20.5,9.5 21.5,8.5 C 21.5,8.5 21.67,9.522 22,10 z" />
            <path
              d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
              fill={isWhite ? strokeColor : fillColor}
            />
            <path
              d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z"
              transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
              fill={isWhite ? strokeColor : highlightColor}
            />
          </g>
        </svg>
      );

    case "b":
      return (
        <svg
          viewBox="0 0 45 45"
          className={`chess-piece ${className}`}
          aria-hidden="true"
          role="img"
        >
          <g
            fill={fillColor}
            fillRule="evenodd"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <g strokeLinejoin="miter">
              <path d="M9 36c1.2-2.5 7-4 13.5-4 6.5 0 12.3 1.5 13.5 4H9z" />
              <path d="M15 32c2.5-2.5 4.5-6 4.5-10.5C19.5 17 21 13 22.5 10c1.5 3 3 7 3 11.5 0 4.5 2 8 4.5 10.5H15z" />
              <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
            </g>
            <path d="M17.5 26h10M22.5 21v10" stroke={strokeColor} strokeWidth="1.5" />
          </g>
        </svg>
      );

    case "q":
      return (
        <svg
          viewBox="0 0 45 45"
          className={`chess-piece ${className}`}
          aria-hidden="true"
          role="img"
        >
          <g
            fill={fillColor}
            fillRule="evenodd"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM32 8.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            <path
              d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1.1 4 1.5 6h20c.4-2 .5-4.5 1.5-6 1-2 2.5-2 2.5-4 0-1.5-1.5-2.5-3-2.5-1.5 0-3 2.5-4 2.5s-2-3.5-3-3.5-2 3.5-3 3.5-1.5-3.5-2.5-3.5-2 3.5-3 3.5-2-2.5-4-2.5c-1.5 0-3 1-3 2.5z"
              strokeLinejoin="miter"
            />
            <path d="M11 36h23" fill="none" />
            <path d="M11 13.5l3.5 11.5M16.5 10l2 15M22.5 9v16M28.5 10l-2 15M34 13.5l-3.5 11.5" />
          </g>
        </svg>
      );

    case "k":
      return (
        <svg
          viewBox="0 0 45 45"
          className={`chess-piece ${className}`}
          aria-hidden="true"
          role="img"
        >
          <g
            fill={fillColor}
            fillRule="evenodd"
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22.5 11.63V6M20 8h5" stroke={strokeColor} strokeWidth="1.5" />
            <path
              d="M22.5 25c-4 0-7-1.5-7-4 0-2.5 3-4 7-4s7 1.5 7 4c0 2.5-3 4-7 4z"
              strokeLinejoin="miter"
            />
            <path d="M11.5 37c0-4 4.5-6 11-6s11 2 11 6h-22z" strokeLinejoin="miter" />
            <path d="M11.5 30c0-2.5 3-4 11-4s11 1.5 11 4" strokeLinejoin="miter" />
            <path d="M22.5 12c-4.5 0-8 3.5-8 8.5 0 2.5 1.5 4.5 3 6.5h10c1.5-2 3-4 3-6.5 0-5-3.5-8.5-8-8.5z" />
          </g>
        </svg>
      );
  }
}
