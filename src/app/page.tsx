import { Suspense } from "react";
import { HomePage } from "@/components/home/home-page";

function LoadingShell() {
  return (
    <main className="app-shell">
      <section className="hero-card hero-card--loading">
        <p className="eyebrow">BlankSage Review Engine</p>
        <h1>Loading homepage</h1>
      </section>
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <HomePage />
    </Suspense>
  );
}
