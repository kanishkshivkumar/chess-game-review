"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ALL_GAMES, registerCustomGame } from "@/lib/review/demo-game";
import { analyzePgnToReviewGame, fetchChessComGame } from "@/lib/review/chesscom-api";
import { BookIcon, LeafIcon, PlayIcon, ZapIcon } from "../game-review/icons";

export function HomePage() {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl ?? inputUrl;
    if (!targetUrl.trim()) {
      setError("Please paste a Chess.com game URL (e.g. https://www.chess.com/game/live/123456789) or PGN.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let pgnText = targetUrl;
      let whiteName = "White";
      let blackName = "Black";
      let result = "*";

      if (targetUrl.includes("chess.com/")) {
        const gameData = await fetchChessComGame(targetUrl);
        pgnText = gameData.pgn;
        whiteName = gameData.white.username;
        blackName = gameData.black.username;
        result = gameData.white.result === "win" ? "1-0" : gameData.black.result === "win" ? "0-1" : "1/2-1/2";
      }

      const customGameSeed = analyzePgnToReviewGame(pgnText, {
        white: whiteName,
        black: blackName,
        result,
      });

      registerCustomGame(customGameSeed);
      router.push(`/review?game=${customGameSeed.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze game. Check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell home-shell">
      <section className="home-hero">
        <div className="home-hero__badge">
          <LeafIcon size={14} />
          <span>BlankSage AI Evaluation Engine</span>
        </div>

        <h1>Analyze Any Chess.com Game</h1>
        <p className="home-hero__sub">
          Paste any Chess.com live or daily game link to generate instant AI-powered move classifications, accuracy breakdowns, and educational takeaways.
        </p>

        <div className="home-input-card">
          <div className="home-input-group">
            <input
              type="text"
              className="home-input"
              placeholder="Paste Chess.com URL (e.g. https://www.chess.com/game/live/108573212879) or PGN..."
              value={inputUrl}
              onChange={(e) => {
                setInputUrl(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAnalyze();
                }
              }}
            />
            <button
              type="button"
              className="home-analyze-btn"
              onClick={() => handleAnalyze()}
              disabled={loading}
            >
              {loading ? (
                <span>Analyzing...</span>
              ) : (
                <>
                  <span>Analyze Game</span>
                  <PlayIcon size={13} />
                </>
              )}
            </button>
          </div>

          {error ? <p className="home-error">{error}</p> : null}

          <div className="home-samples">
            <span className="home-samples__label">Try Featured Games:</span>
            <div className="home-samples__pills">
              {ALL_GAMES.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  className="sample-pill"
                  onClick={() => router.push(`/review?game=${game.id}`)}
                >
                  <span>{game.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-featured">
        <div className="home-section-header">
          <h2>Featured Review Fixtures</h2>
          <p>Explore classic tactical games pre-annotated with BlankSage evaluation feedback.</p>
        </div>

        <div className="featured-grid">
          {ALL_GAMES.map((game) => (
            <article key={game.id} className="featured-card">
              <div className="featured-card__header">
                <span className="featured-card__opening">{game.opening}</span>
                <span className="featured-card__result">{game.result}</span>
              </div>
              <h3>{game.title}</h3>
              <p className="featured-card__players">
                {game.white} vs {game.black}
              </p>
              <p className="featured-card__narrative">{game.narrative}</p>

              <button
                type="button"
                className="featured-card__btn"
                onClick={() => router.push(`/review?game=${game.id}`)}
              >
                <span>Step into Replay</span>
                <PlayIcon size={12} />
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
