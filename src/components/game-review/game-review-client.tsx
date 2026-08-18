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
  const [sidebarTab, setSidebarTab] = useState<"review" | "moves">("review");

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
      const el = activeMoveRef.current;
      const container = el.closest(".move-list");
      if (container instanceof HTMLElement) {
        const elTop = el.offsetTop;
        const elHeight = el.offsetHeight;
        const containerTop = container.scrollTop;
        const containerHeight = container.clientHeight;

        if (elTop < containerTop) {
          container.scrollTop = elTop;
        } else if (elTop + elHeight > containerTop + containerHeight) {
          container.scrollTop = elTop + elHeight - containerHeight;
        }
      }
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

      if (event.key === "ArrowRight" || event.key === " ") {
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
    <main className="app-shell chesscom-shell">
      {/* Top Header Bar */}
      <header className="chesscom-top-bar">
        <div className="chesscom-top-bar__left">
          <a href="/" className="chesscom-logo">
            <span className="chesscom-logo__badge">CHESS</span>
            <span className="chesscom-logo__title">Game Review</span>
          </a>

          <select
            className="chesscom-game-select"
            value={selectedGameId}
            onChange={(e) => handleSelectGame(e.target.value)}
            aria-label="Select game to review"
          >
            {ALL_GAMES.map((game) => (
              <option key={game.id} value={game.id}>
                {game.title} ({game.white} vs {game.black})
              </option>
            ))}
          </select>
        </div>

        <div className="chesscom-top-bar__right">
          <div className="theme-picker" aria-label="Visual Theme Switcher">
            <button
              type="button"
              className={`theme-btn ${theme === "sage" ? "theme-btn--active" : ""}`}
              onClick={() => handleThemeChange("sage")}
            >
              <LeafIcon size={12} /> Dark
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === "classic" ? "theme-btn--active" : ""}`}
              onClick={() => handleThemeChange("classic")}
            >
              <BookIcon size={12} /> Wood
            </button>
            <button
              type="button"
              className={`theme-btn ${theme === "cyber" ? "theme-btn--active" : ""}`}
              onClick={() => handleThemeChange("cyber")}
            >
              <ZapIcon size={12} /> Cyber
            </button>
          </div>

          <button
            type="button"
            className="sound-toggle-btn"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute move sounds" : "Mute move sounds"}
          >
            {isMuted ? <VolumeMutedIcon size={14} /> : <VolumeOnIcon size={14} />}
          </button>
        </div>
      </header>

      {/* Main 2-Column Chess.com Game Review Layout */}
      <div className="chesscom-layout">
        {/* LEFT COLUMN: BLACK PLAYER -> BOARD + EVAL -> WHITE PLAYER -> CONTROLS */}
        <section className="chesscom-board-column">
          {/* Black Player Bar */}
          <div className="player-bar player-bar--black">
            <div className="player-info">
              <span className="player-avatar player-avatar--black">♟</span>
              <span className="player-name">{timeline.game.black}</span>
            </div>
            <div className="player-acc">
              {snapshot.ply > 0 ? <span>Accuracy {gameSummary.accuracyEstimate.black}%</span> : null}
              {timeline.game.result === "0-1" ? <span className="winner-tag">★ Winner</span> : null}
            </div>
          </div>

          {/* Board + Eval Bar Container */}
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

          {/* White Player Bar */}
          <div className="player-bar player-bar--white">
            <div className="player-info">
              <span className="player-avatar player-avatar--white">♙</span>
              <span className="player-name">{timeline.game.white}</span>
            </div>
            <div className="player-acc">
              {snapshot.ply > 0 ? <span>Accuracy {gameSummary.accuracyEstimate.white}%</span> : null}
              {timeline.game.result === "1-0" ? <span className="winner-tag">★ Winner</span> : null}
            </div>
          </div>

          {/* Bottom Control Bar */}
          <nav className="chesscom-controls-bar" aria-label="Chessboard replay controls">
            <button
              type="button"
              onClick={() => handleSelectPly(0)}
              disabled={snapshot.ply === 0}
              title="First move (Home)"
            >
              <RewindIcon size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleSelectPly(goToPreviousPly(selectedPly))}
              disabled={!snapshot.canGoPrevious}
              title="Previous move (Left Arrow)"
            >
              <ChevronLeftIcon size={18} />
            </button>

            <button
              type="button"
              className="ctrl-btn-next"
              onClick={() => handleSelectPly(goToNextPly(selectedPly, totalPlies))}
              disabled={!snapshot.canGoNext}
              title="Next move (Right Arrow / Spacebar)"
            >
              <span>Next Move</span>
              <ChevronRightIcon size={18} />
            </button>

            <button
              type="button"
              onClick={() => handleSelectPly(totalPlies)}
              disabled={snapshot.ply === totalPlies}
              title="Last move (End)"
            >
              <FastForwardIcon size={16} />
            </button>
          </nav>
        </section>

        {/* RIGHT COLUMN: SIDEBAR WITH REVIEW / MOVES TABS */}
        <aside className="chesscom-sidebar-column">
          <div className="sidebar-tabs">
            <button
              type="button"
              className={`sidebar-tab ${sidebarTab === "review" ? "sidebar-tab--active" : ""}`}
              onClick={() => setSidebarTab("review")}
            >
              Coach Review
            </button>
            <button
              type="button"
              className={`sidebar-tab ${sidebarTab === "moves" ? "sidebar-tab--active" : ""}`}
              onClick={() => setSidebarTab("moves")}
            >
              Move List
            </button>
          </div>

          {sidebarTab === "review" ? (
            <article className="coach-card" aria-live="polite">
              <div className="coach-card__header">
                <div className="coach-avatar">🎓</div>
                <div className="coach-meta">
                  <span className="coach-meta__title">BlankSage AI Coach</span>
                  <span className="coach-meta__step">
                    Move {snapshot.ply} of {snapshot.totalPlies}
                  </span>
                </div>
              </div>

              <div className="coach-card__banner">
                <span className={`badge badge--${genericReviewItem.classificationTone}`}>
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

              <h2 className="coach-card__move-title">{genericReviewItem.title}</h2>
              <p className="coach-card__subtitle">{genericReviewItem.subtitle}</p>

              {genericReviewItem.learningCategory ? (
                <div className="learning-category-tag">
                  {getCategoryIcon(genericReviewItem.learningCategory)}
                  <span>{genericReviewItem.learningCategory}</span>
                </div>
              ) : null}

              <p className="coach-card__explanation">{genericReviewItem.explanation}</p>

              {snapshot.ply === 0 ? (
                <div className="coach-summary-panel">
                  <div className="accuracy-box">
                    <div className="acc-item">
                      <span className="acc-item__name">White ({timeline.game.white})</span>
                      <span className="acc-item__val">{gameSummary.accuracyEstimate.white}%</span>
                    </div>
                    <div className="acc-item">
                      <span className="acc-item__name">Black ({timeline.game.black})</span>
                      <span className="acc-item__val">{gameSummary.accuracyEstimate.black}%</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="start-review-button"
                    onClick={() => handleSelectPly(1)}
                  >
                    <span>Start Replay Review</span>
                    <PlayIcon size={13} />
                  </button>
                </div>
              ) : null}
            </article>
          ) : null}

          {/* Move List Container */}
          <article className={`move-list-card ${sidebarTab === "moves" ? "move-list-card--full" : ""}`}>
            <div className="move-list-card__header">
              <h3>Move List</h3>
              <span className="move-count-badge">{timeline.moves.length} moves</span>
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
                      onClick={() => handleSelectPly(whiteMove.ply)}
                    >
                      <span className="move-chip__san">{whiteMove.san}</span>
                      <span className="move-chip__symbol">
                        {getClassificationSymbol(whiteMove.classification)}
                      </span>
                    </button>

                    {blackMove ? (
                      <button
                        ref={isBlackActive ? activeMoveRef : null}
                        type="button"
                        className={`move-chip ${isBlackActive ? "move-chip--active" : ""} move-chip--${blackMove.classification}`}
                        onClick={() => handleSelectPly(blackMove.ply)}
                      >
                        <span className="move-chip__san">{blackMove.san}</span>
                        <span className="move-chip__symbol">
                          {getClassificationSymbol(blackMove.classification)}
                        </span>
                      </button>
                    ) : (
                      <span className="move-chip move-chip--empty">—</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </article>
        </aside>
      </div>
    </main>
  );
}
