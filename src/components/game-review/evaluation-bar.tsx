import React from "react";

interface EvaluationBarProps {
  score?: number; // numerical score in pawns from White's perspective (+ values White advantage, - values Black advantage)
  isMate?: boolean;
  winningSide?: "white" | "black";
}

export function EvaluationBar({ score = 0, isMate, winningSide }: EvaluationBarProps) {
  let whitePercentage = 50;
  let label = "+0.0";

  if (isMate) {
    if (winningSide === "white" || score > 0) {
      whitePercentage = 100;
      label = "M1";
    } else {
      whitePercentage = 0;
      label = "-M1";
    }
  } else {
    // Sigmoid or clamped linear mapping from pawn score (-10 to +10) to 0% - 100%
    const clampedScore = Math.max(-10, Math.min(10, score));
    whitePercentage = Math.round(50 + (clampedScore / 10) * 45);

    if (score > 0) {
      label = `+${score.toFixed(1)}`;
    } else if (score < 0) {
      label = score.toFixed(1);
    } else {
      label = "0.0";
    }
  }

  const blackPercentage = 100 - whitePercentage;

  return (
    <div
      className="eval-bar"
      aria-label={`Position evaluation: ${label}`}
      title={`Evaluation: ${label}`}
    >
      <div
        className="eval-bar__black"
        style={{ height: `${blackPercentage}%` }}
      />
      <div
        className="eval-bar__white"
        style={{ height: `${whitePercentage}%` }}
      />
      <span className={`eval-bar__label ${score >= 0 ? "eval-bar__label--white" : "eval-bar__label--black"}`}>
        {label}
      </span>
    </div>
  );
}
