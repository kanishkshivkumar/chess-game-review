"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { formatPlyLabel, goToNextPly, goToPreviousPly, clampPly } from "@/lib/review/navigation";
import { getClassificationLabel, getClassificationTone } from "@/lib/review/labels";
import { getReviewSnapshot } from "@/lib/review/selectors";
import { getBoardPieceMap, getPieceGlyph } from "@/lib/review/board";
import type { ReviewTimeline } from "@/lib/review/types";

interface GameReviewClientProps {
  timeline: ReviewTimeline;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

function parsePly(value: string | null): number {
  if (!value) {
    return 0;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function GameReviewClient({ timeline }: GameReviewClientProps) {
  const searchParams = useSearchParams();
  const totalPlies = timeline.moves.length;
  const [selectedPly, setSelectedPly] = useState(() =>
    clampPly(parsePly(searchParams.get("ply")), totalPlies),
  );

  const snapshot = getReviewSnapshot(timeline, selectedPly);
  const currentMove = snapshot.move;
  const pieces = getBoardPieceMap(snapshot.frame.fen);

  useEffect(() => {
    setSelectedPly((current) => clampPly(current, totalPlies));
  }, [totalPlies]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const url = new URL(window.location.href);

    if (selectedPly === 0) {
      url.searchParams.delete("ply");
    } else {
      url.searchParams.set("ply", String(selectedPly));
    }

    window.history.replaceState({}, "", url);
  }, [selectedPly]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setSelectedPly((current) => goToPreviousPly(current));
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setSelectedPly((current) => goToNextPly(current, totalPlies));
      }

      if (event.key === "Home") {
        event.preventDefault();
        setSelectedPly(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        setSelectedPly(totalPlies);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalPlies]);

  if (totalPlies === 0) {
    return (
      <main className="app-shell">
        <section className="empty-state">
          <p className="eyebrow">BlankSage review replay</p>
          <h1>Nothing to review yet</h1>
          <p>
            The app is waiting for a completed game fixture. Add one to `src/lib/review/demo-game.ts`
            and the replay shell will pick it up automatically.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-card__intro">
          <p className="eyebrow">BlankSage review replay</p>
          <h1>{timeline.game.title}</h1>
          <p className="hero-card__narrative">{timeline.game.narrative}</p>
        </div>

        <dl className="hero-card__meta" aria-label="Game summary">
          <div>
            <dt>White</dt>
            <dd>{timeline.game.white}</dd>
          </div>
          <div>
            <dt>Black</dt>
            <dd>{timeline.game.black}</dd>
          </div>
          <div>
            <dt>Result</dt>
            <dd>{timeline.game.result}</dd>
          </div>
          <div>
            <dt>Opening</dt>
            <dd>{timeline.game.opening}</dd>
          </div>
        </dl>
      </section>

      <section className="review-grid">
        <div className="review-grid__board-column">
          <article className="board-card">
            <div className="board-card__header">
              <div>
                <p className="board-card__title">Board position</p>
                <p className="board-card__subtitle">{formatPlyLabel(snapshot.ply)}</p>
              </div>
              <div className="board-card__progress">
                <span>
                  {snapshot.ply} / {snapshot.totalPlies}
                </span>
                <progress value={snapshot.ply} max={snapshot.totalPlies} />
              </div>
            </div>

            <div className="board" aria-label={`Chess board at ${formatPlyLabel(snapshot.ply)}`}>
              {RANKS.map((rank, rankIndex) =>
                FILES.map((file, fileIndex) => {
                  const square = `${file}${rank}`;
                  const piece = pieces[square];
                  const isLightSquare = (rankIndex + fileIndex) % 2 === 0;
                  const isFrom = snapshot.frame.lastMove?.from === square;
                  const isTo = snapshot.frame.lastMove?.to === square;

                  return (
                    <div
                      key={square}
                      className={[
                        "board__square",
                        isLightSquare ? "board__square--light" : "board__square--dark",
                        isFrom ? "board__square--from" : "",
                        isTo ? "board__square--to" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      data-square={square}
                    >
                      {fileIndex === 0 ? (
                        <span className="board__rank-label">{rank}</span>
                      ) : null}
                      {rankIndex === RANKS.length - 1 ? (
                        <span className="board__file-label">{file}</span>
                      ) : null}
                      {piece ? <span className={`board__piece board__piece--${piece.color}`}>{getPieceGlyph(piece)}</span> : null}
                    </div>
                  );
                }),
              )}
            </div>

            <nav className="board-card__controls" aria-label="Review navigation">
              <button type="button" onClick={() => setSelectedPly(0)} disabled={snapshot.ply === 0}>
                Start
              </button>
              <button
                type="button"
                onClick={() => setSelectedPly((current) => goToPreviousPly(current))}
                disabled={!snapshot.canGoPrevious}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setSelectedPly((current) => goToNextPly(current, totalPlies))}
                disabled={!snapshot.canGoNext}
              >
                Next
              </button>
              <button type="button" onClick={() => setSelectedPly(totalPlies)} disabled={snapshot.ply === totalPlies}>
                End
              </button>
            </nav>
          </article>
        </div>

        <aside className="review-grid__sidebar">
          <article className="insight-card" aria-live="polite">
            <div className="insight-card__header">
              <p className="insight-card__eyebrow">Current review</p>
              <span className={`badge badge--${currentMove ? getClassificationTone(currentMove.classification) : "neutral"}`}>
                {currentMove ? getClassificationLabel(currentMove.classification) : "Start position"}
              </span>
            </div>

            <h2>{currentMove ? currentMove.san : "Initial position"}</h2>
            <p className="insight-card__move">
              {currentMove ? `${currentMove.moveNumber}${currentMove.side === "white" ? "." : "..."} ${currentMove.side.toUpperCase()} move` : "White to move"}
            </p>
            <p className="insight-card__explanation">
              {currentMove
                ? currentMove.explanation
                : "Use the navigation buttons or the move list to step into the review."}
            </p>

            <div className="insight-card__notes">
              <div>
                <dt>Side to play</dt>
                <dd>{selectedPly % 2 === 0 ? "White" : "Black"}</dd>
              </div>
              <div>
                <dt>Review step</dt>
                <dd>
                  {snapshot.ply} of {snapshot.totalPlies}
                </dd>
              </div>
            </div>
          </article>

          <article className="move-list-card">
            <div className="move-list-card__header">
              <div>
                <p className="move-list-card__eyebrow">Move list</p>
                <h2>Review sequence</h2>
              </div>
              <p className="move-list-card__hint">Click any move or use the arrow keys.</p>
            </div>

            <ol className="move-list" aria-label="Move list">
              {Array.from({ length: Math.ceil(timeline.moves.length / 2) }, (_, rowIndex) => {
                const whiteMove = timeline.moves[rowIndex * 2];
                const blackMove = timeline.moves[rowIndex * 2 + 1];

                return (
                  <li key={whiteMove.ply} className="move-list__row">
                    <span className="move-list__number">{whiteMove.moveNumber}.</span>
                    <button
                      type="button"
                      className={`move-chip ${snapshot.move?.ply === whiteMove.ply ? "move-chip--active" : ""} move-chip--${whiteMove.classification}`}
                      aria-current={snapshot.move?.ply === whiteMove.ply ? "true" : undefined}
                      onClick={() => setSelectedPly(whiteMove.ply)}
                    >
                      <span className="move-chip__san">{whiteMove.san}</span>
                      <span className="move-chip__class">{getClassificationLabel(whiteMove.classification)}</span>
                    </button>
                    {blackMove ? (
                      <button
                        type="button"
                        className={`move-chip ${snapshot.move?.ply === blackMove.ply ? "move-chip--active" : ""} move-chip--${blackMove.classification}`}
                        aria-current={snapshot.move?.ply === blackMove.ply ? "true" : undefined}
                        onClick={() => setSelectedPly(blackMove.ply)}
                      >
                        <span className="move-chip__san">{blackMove.san}</span>
                        <span className="move-chip__class">{getClassificationLabel(blackMove.classification)}</span>
                      </button>
                    ) : (
                      <span className="move-chip move-chip--empty" aria-hidden="true">
                        —
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </article>
        </aside>
      </section>
    </main>
  );
}
