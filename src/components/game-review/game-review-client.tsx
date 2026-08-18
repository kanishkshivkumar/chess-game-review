"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { ChessPiece } from "./chess-pieces";
import { EvaluationBar } from "./evaluation-bar";
import {
  AlertTriangleIcon,
  BookIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FastForwardIcon,
  GraduationCapIcon,
  LeafIcon,
  PlayIcon,
  RewindIcon,
  ShieldIcon,
  TrophyIcon,
  VolumeMutedIcon,
  VolumeOnIcon,
  ZapIcon,
} from "./icons";
import { soundSynth } from "@/lib/review/audio";
import { ALL_GAMES, DEFAULT_GAME_ID, GAMES_MAP, getGameTimeline } from "@/lib/review/demo-game";
import { getBoardPieceMap } from "@/lib/review/board";
import { getClassificationLabel, getClassificationSymbol } from "@/lib/review/labels";
import { clampPly, formatPlyLabel, goToNextPly, goToPreviousPly } from "@/lib/review/navigation";
import { getReviewSnapshot } from "@/lib/review/selectors";
import { calculateGameSummary, toGenericReviewItem } from "@/lib/review/adapter";
import type { ReviewTimeline } from "@/lib/review/types";

interface GameReviewClientProps {
  timeline?: ReviewTimeline;
}

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

type AppTheme = "sage" | "classic" | "cyber";

function parsePly(value: string | null): number {
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveGameId(value: string | null): string {
  if (value && value in GAMES_MAP) return value;
  return DEFAULT_GAME_ID;
}

function getCategoryIcon(category?: string) {
  if (!category) return null;
  if (category.includes("Opening")) return <GraduationCapIcon size={14} className="category-icon" />;
  if (category.includes("Tactical")) return <AlertTriangleIcon size={14} className="category-icon" />;
  if (category.includes("Defensive")) return <ShieldIcon size={14} className="category-icon" />;
  if (category.includes("Finishing")) return <TrophyIcon size={14} className="category-icon" />;
  return null;
}

export function GameReviewClient({ timeline: propTimeline }: GameReviewClientProps) {
  const searchParams = useSearchParams();

  const [selectedGameId, setSelectedGameId] = useState<string>(() =>
    resolveGameId(searchParams.get("game")),
  );

  const timeline = propTimeline ?? getGameTimeline(selectedGameId);
  const totalPlies = timeline.moves.length;

  const [selectedPly, setSelectedPly] = useState<number>(() =>
    clampPly(parsePly(searchParams.get("ply")), totalPlies),
  );

  const [theme, setTheme] = useState<AppTheme>("sage");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const activeMoveRef = useRef<HTMLButtonElement | null>(null);

  const snapshot = getReviewSnapshot(timeline, selectedPly);
  const genericReviewItem = toGenericReviewItem(snapshot.move);
  const gameSummary = calculateGameSummary(timeline);
  const pieces = getBoardPieceMap(snapshot.frame.fen);

  const syncUrlState = useCallback((gameId: string, ply: number) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);

    if (gameId === DEFAULT_GAME_ID) {
      url.searchParams.delete("game");
    } else {
      url.searchParams.set("game", gameId);
    }

    if (ply === 0) {
      url.searchParams.delete("ply");
    } else {
      url.searchParams.set("ply", String(ply));
    }

    window.history.replaceState({}, "", url);
  }, []);

  const handleSelectGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setSelectedPly(0);
    syncUrlState(gameId, 0);
  };

  const handleSelectPly = (ply: number) => {
    const clamped = clampPly(ply, totalPlies);
    setSelectedPly(clamped);
    syncUrlState(selectedGameId, clamped);

    if (clamped > 0) {
      const move = timeline.moves[clamped - 1];
      const isCheck = move?.san.includes("+");
      const isMate = move?.san.includes("#");
      const isCapture = move?.san.includes("x");
      soundSynth.playMoveSound(isCapture, isCheck, isMate);
    }
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = newTheme;
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundSynth.setMuted(nextMuted);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = theme;
    }
  }, [theme]);

  useEffect(() => {
    const clamped = clampPly(selectedPly, totalPlies);
    if (clamped !== selectedPly) {
      setSelectedPly(clamped);
    }
  }, [totalPlies, selectedPly]);

  useEffect(() => {
    syncUrlState(selectedGameId, selectedPly);
  }, [selectedGameId, selectedPly, syncUrlState]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlGameId = resolveGameId(params.get("game"));
      const targetTimeline = getGameTimeline(urlGameId);
      const urlPly = clampPly(parsePly(params.get("ply")), targetTimeline.moves.length);

      setSelectedGameId(urlGameId);
      setSelectedPly(urlPly);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (activeMoveRef.current) {
      activeMoveRef.current.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedPly, selectedGameId]);

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
        handleSelectPly(goToPreviousPly(selectedPly));
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleSelectPly(goToNextPly(selectedPly, totalPlies));
      }

      if (event.key === "Home") {
        event.preventDefault();
        handleSelectPly(0);
      }

      if (event.key === "End") {
        event.preventDefault();
        handleSelectPly(totalPlies);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPly, totalPlies, selectedGameId]);

  if (totalPlies === 0) {
    return (
      <main className="app-shell">
        <section className="empty-state">
          <p className="eyebrow">BlankSage review replay</p>
          <h1>Nothing to review yet</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="hero-card">
        <div className="hero-card__intro">
          <div className="hero-card__top-bar">
            <div className="hero-card__game-picker">
              <span className="eyebrow">Select Review Fixture</span>
              <select
                className="game-select-dropdown"
                value={selectedGameId}
                onChange={(e) => handleSelectGame(e.target.value)}
                aria-label="Select completed chess game to review"
              >
                {ALL_GAMES.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.title} ({game.white} vs {game.black})
                  </option>
                ))}
              </select>
            </div>

            <div className="theme-sound-controls">
              <div className="theme-picker" aria-label="Visual Theme Switcher">
                <button
                  type="button"
                  className={`theme-btn ${theme === "sage" ? "theme-btn--active" : ""}`}
                  onClick={() => handleThemeChange("sage")}
                  title="BlankSage Sage Obsidian Theme"
                >
                  <LeafIcon size={13} /> Sage
                </button>
                <button
                  type="button"
                  className={`theme-btn ${theme === "classic" ? "theme-btn--active" : ""}`}
                  onClick={() => handleThemeChange("classic")}
                  title="Grandmaster Classic Parchment Theme"
                >
                  <BookIcon size={13} /> Classic
                </button>
                <button
                  type="button"
                  className={`theme-btn ${theme === "cyber" ? "theme-btn--active" : ""}`}
                  onClick={() => handleThemeChange("cyber")}
                  title="Midnight Cyber Theme"
                >
                  <ZapIcon size={13} /> Cyber
                </button>
              </div>

              <button
                type="button"
                className="sound-toggle-btn"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute move sounds" : "Mute move sounds"}
                title={isMuted ? "Unmute move sounds" : "Mute move sounds"}
              >
                {isMuted ? (
                  <>
                    <VolumeMutedIcon size={14} /> Muted
                  </>
                ) : (
                  <>
                    <VolumeOnIcon size={14} /> Sound On
                  </>
                )}
              </button>
            </div>
          </div>

          <h1>{timeline.game.title}</h1>
          <p className="hero-card__narrative">{timeline.game.narrative}</p>
        </div>

        <dl className="hero-card__meta" aria-label="Game summary statistics">
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
      </header>

      <section className="review-grid">
        <div className="review-grid__board-column">
          <article className="board-card">
            <div className="board-card__header">
              <div>
                <p className="board-card__title">Board Position</p>
                <p className="board-card__subtitle">{formatPlyLabel(snapshot.ply)}</p>
              </div>
              <div className="board-card__progress">
                <span>
                  {snapshot.ply} / {snapshot.totalPlies}
                </span>
                <progress
                  value={snapshot.ply}
                  max={snapshot.totalPlies}
                  aria-label={`Game replay progress: step ${snapshot.ply} of ${snapshot.totalPlies}`}
                />
              </div>
            </div>

            <div className="board-with-eval">
              <EvaluationBar
                score={snapshot.move?.evalScore ?? 0}
                isMate={snapshot.move?.isMate}
                winningSide={snapshot.move?.side}
              />

              <div
                className="board"
                aria-label={`Chessboard position at ${formatPlyLabel(snapshot.ply)}`}
                role="region"
              >
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
                        aria-label={`${square}${piece ? `, ${piece.color === "w" ? "White" : "Black"} ${piece.type.toUpperCase()}` : ""}`}
                      >
                        {fileIndex === 0 ? (
                          <span className="board__rank-label" aria-hidden="true">
                            {rank}
                          </span>
                        ) : null}
                        {rankIndex === RANKS.length - 1 ? (
                          <span className="board__file-label" aria-hidden="true">
                            {file}
                          </span>
                        ) : null}
                        {piece ? <ChessPiece piece={piece} /> : null}
                      </div>
                    );
                  }),
                )}
              </div>
            </div>

            <nav className="board-card__controls" aria-label="Review timeline controls">
              <button
                type="button"
                onClick={() => handleSelectPly(0)}
                disabled={snapshot.ply === 0}
                aria-label="Go to start position (Home)"
              >
                <RewindIcon size={14} /> Start
              </button>
              <button
                type="button"
                onClick={() => handleSelectPly(goToPreviousPly(selectedPly))}
                disabled={!snapshot.canGoPrevious}
                aria-label="Go to previous move (Left Arrow)"
              >
                <ChevronLeftIcon size={14} /> Previous
              </button>
              <button
                type="button"
                onClick={() => handleSelectPly(goToNextPly(selectedPly, totalPlies))}
                disabled={!snapshot.canGoNext}
                aria-label="Go to next move (Right Arrow)"
              >
                Next <ChevronRightIcon size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleSelectPly(totalPlies)}
                disabled={snapshot.ply === totalPlies}
                aria-label="Go to final position (End)"
              >
                End <FastForwardIcon size={14} />
              </button>
            </nav>
          </article>
        </div>

        <aside className="review-grid__sidebar">
          <article className="insight-card" aria-live="polite">
            <div className="insight-card__header">
              <p className="insight-card__eyebrow">BlankSage AI Feedback</p>
              <span
                className={`badge badge--${genericReviewItem.classificationTone}`}
                aria-label={`Classification: ${genericReviewItem.classification}`}
              >
                {genericReviewItem.classification !== "neutral" ? (
                  <span className="badge__symbol" aria-hidden="true">
                    {getClassificationSymbol(genericReviewItem.classification as any)}{" "}
                  </span>
                ) : null}
                {genericReviewItem.classification !== "neutral"
                  ? getClassificationLabel(genericReviewItem.classification as any)
                  : "Start position"}
              </span>
            </div>

            <h2>{genericReviewItem.title}</h2>
            <p className="insight-card__move">{genericReviewItem.subtitle}</p>

            {genericReviewItem.learningCategory ? (
              <div className="learning-category-tag">
                {getCategoryIcon(genericReviewItem.learningCategory)}
                <span>{genericReviewItem.learningCategory}</span>
              </div>
            ) : null}

            <p className="insight-card__explanation">{genericReviewItem.explanation}</p>

            {snapshot.ply === 0 ? (
              <div className="insight-card__summary-panel">
                <div className="summary-accuracies">
                  <div className="accuracy-pill">
                    <span className="accuracy-pill__label">White Accuracy</span>
                    <span className="accuracy-pill__value">{gameSummary.accuracyEstimate.white}%</span>
                  </div>
                  <div className="accuracy-pill">
                    <span className="accuracy-pill__label">Black Accuracy</span>
                    <span className="accuracy-pill__value">{gameSummary.accuracyEstimate.black}%</span>
                  </div>
                </div>

                <div className="summary-breakdown-grid">
                  <div className="summary-breakdown-col">
                    <span className="summary-col-header">White ({timeline.game.white})</span>
                    <ul className="summary-counts-list">
                      <li>
                        <span className="badge-dot badge-dot--best" /> {gameSummary.whiteBreakdown.best} Best
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--good" /> {gameSummary.whiteBreakdown.good} Good
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--inaccuracy" /> {gameSummary.whiteBreakdown.inaccuracy} Inaccuracies
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--mistake" /> {gameSummary.whiteBreakdown.mistake} Mistakes
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--blunder" /> {gameSummary.whiteBreakdown.blunder} Blunders
                      </li>
                    </ul>
                  </div>
                  <div className="summary-breakdown-col">
                    <span className="summary-col-header">Black ({timeline.game.black})</span>
                    <ul className="summary-counts-list">
                      <li>
                        <span className="badge-dot badge-dot--best" /> {gameSummary.blackBreakdown.best} Best
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--good" /> {gameSummary.blackBreakdown.good} Good
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--inaccuracy" /> {gameSummary.blackBreakdown.inaccuracy} Inaccuracies
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--mistake" /> {gameSummary.blackBreakdown.mistake} Mistakes
                      </li>
                      <li>
                        <span className="badge-dot badge-dot--blunder" /> {gameSummary.blackBreakdown.blunder} Blunders
                      </li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  className="start-review-button"
                  onClick={() => handleSelectPly(1)}
                >
                  <span>Start Replay Review</span>
                  <PlayIcon size={12} />
                </button>
              </div>
            ) : (
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
            )}
          </article>

          <article className="move-list-card">
            <div className="move-list-card__header">
              <div>
                <p className="move-list-card__eyebrow">Move list</p>
                <h2>Review sequence</h2>
              </div>
              <p className="move-list-card__hint">Click any move or use arrow keys.</p>
            </div>

            <ol className="move-list" aria-label="Move list">
              {Array.from({ length: Math.ceil(timeline.moves.length / 2) }, (_, rowIndex) => {
                const whiteMove = timeline.moves[rowIndex * 2];
                const blackMove = timeline.moves[rowIndex * 2 + 1];

                const isWhiteActive = snapshot.move?.ply === whiteMove.ply;
                const isBlackActive = blackMove && snapshot.move?.ply === blackMove.ply;

                return (
                  <li key={whiteMove.ply} className="move-list__row">
                    <span className="move-list__number">{whiteMove.moveNumber}.</span>
                    <button
                      ref={isWhiteActive ? activeMoveRef : null}
                      type="button"
                      className={`move-chip ${isWhiteActive ? "move-chip--active" : ""} move-chip--${whiteMove.classification}`}
                      aria-current={isWhiteActive ? "true" : undefined}
                      aria-label={`Move ${whiteMove.moveNumber} White: ${whiteMove.san}, ${getClassificationLabel(whiteMove.classification)}`}
                      onClick={() => handleSelectPly(whiteMove.ply)}
                    >
                      <div className="move-chip__header">
                        <span className="move-chip__san">{whiteMove.san}</span>
                        <span className="move-chip__symbol" aria-hidden="true">
                          {getClassificationSymbol(whiteMove.classification)}
                        </span>
                      </div>
                      <span className="move-chip__class">{getClassificationLabel(whiteMove.classification)}</span>
                    </button>

                    {blackMove ? (
                      <button
                        ref={isBlackActive ? activeMoveRef : null}
                        type="button"
                        className={`move-chip ${isBlackActive ? "move-chip--active" : ""} move-chip--${blackMove.classification}`}
                        aria-current={isBlackActive ? "true" : undefined}
                        aria-label={`Move ${blackMove.moveNumber} Black: ${blackMove.san}, ${getClassificationLabel(blackMove.classification)}`}
                        onClick={() => handleSelectPly(blackMove.ply)}
                      >
                        <div className="move-chip__header">
                          <span className="move-chip__san">{blackMove.san}</span>
                          <span className="move-chip__symbol" aria-hidden="true">
                            {getClassificationSymbol(blackMove.classification)}
                          </span>
                        </div>
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
