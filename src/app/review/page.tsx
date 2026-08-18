import { Suspense } from "react";

import { GameReviewClient } from "@/components/game-review/game-review-client";

function LoadingShell() {
  return (
    <main className="app-shell">
      <section className="hero-card hero-card--loading">
        <p className="eyebrow">BlankSage review replay</p>
        <h1>Loading review</h1>
        <p className="hero-card__narrative">Preparing the board, move list, and review annotations.</p>
      </section>
    </main>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <GameReviewClient />
    </Suspense>
  );
}
