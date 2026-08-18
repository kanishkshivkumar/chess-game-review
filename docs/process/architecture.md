# Architecture & Domain Design Notes

## Product & Domain Abstraction

The BlankSage Game Review Replay application is built around a single, decoupled review shell capable of rendering explorable step-by-step evaluations.

Although initialized with completed chess games, the architecture strictly separates the **chess domain model** from the **generic review presentation shell**:

```
 ┌─────────────────────────────────────────────────────────┐
 │                   Chess Game Seed                       │
 │  (PGN/SAN moves, classifications, annotations, FENs)    │
 └────────────────────────────┬────────────────────────────┘
                              │ buildReviewTimeline()
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                   Review Timeline                       │
 │        (Frames, Moves, Board Snapshots, Plies)          │
 └────────────────────────────┬────────────────────────────┘
                              │ toGenericReviewItem()
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                Generic Review Interface                 │
 │   (GenericReviewItem: id, stepIndex, title, subtitle,   │
 │        classification, tone, explanation, metadata)     │
 └────────────────────────────┬────────────────────────────┘
                              │
                              ▼
 ┌─────────────────────────────────────────────────────────┐
 │                 GameReviewClient Shell                  │
 │    (SVG Board, Move List, Review Panel, URL State,      │
 │             Keyboard Controls, Game Selector)           │
 └─────────────────────────────────────────────────────────┘
```

## Key Architectural Principles

### 1. Maintainable BlankSage Evaluation Evolution
As required by Section 4.3 of the PRD, the review shell does not hardcode chess logic into presentation components:
- `src/lib/review/adapter.ts` provides `toGenericReviewItem()`, transforming chess moves into `GenericReviewItem` structures (containing `title`, `subtitle`, `classification`, `explanation`, and `metadata`).
- Future BlankSage student assessment questions can replace chess moves by implementing a `GenericReviewItem` adapter without rewriting the UI shell.

### 2. Single Source of Truth Navigation
- All components (Chessboard position, Move list active state, Review feedback card, Progress bar) derive their state from a single `selectedPly` integer.
- URL query parameters (`?game=<id>&ply=<n>`) synchronize with application state.
- `window.history.replaceState` and `popstate` event listeners enable seamless browser back/forward history navigation.

### 3. Accessible & Resolution-Independent Rendering
- The chessboard uses custom SVG vector piece graphics (`src/components/game-review/chess-pieces.tsx`), replacing unicode font glyphs for crisp rendering across operating systems.
- Move classifications use both color badges and non-color symbols (`✓`, `👍`, `?!`, `?`, `??`) to ensure accessibility for colorblind users.
- Full ARIA semantics (`aria-label`, `aria-current`, `aria-live`, `aria-valuenow`) and keyboard controls (`ArrowLeft`, `ArrowRight`, `Home`, `End`) are implemented throughout.

### 4. Summary & Accuracy Breakdown
- When at the start position (ply 0), `calculateGameSummary()` computes White/Black move quality breakdowns and overall accuracy percentages, giving users an immediate overview of the game before diving into move replay.
