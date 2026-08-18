# BlankSage Review Replay

A polished, maintainable recreation of the core Chess.com Game Review flow, built with Next.js, TypeScript, and React as a complete product experience.

## Features

- **Interactive Review Shell**: Synchronized chessboard, move list, selected move, game progress, and review explanation panel.
- **Multiple Predefined Annotated Games**:
  - *Blackburne Shilling Trap* (14 plies / 7 moves)
  - *Morphy's Opera Game* (34 plies / 17 moves)
  - *Scholar's Mate* (8 plies / 4 moves)
- **Vector SVG Chess Pieces**: Custom resolution-independent SVG piece set ensuring crisp, uniform rendering across all operating systems and devices.
- **Non-Color Classification Signals**: Move quality badges with explicit symbols (`✓` Best, `👍` Good, `?!` Inaccuracy, `?` Mistake, `??` Blunder) for full accessibility.
- **Game Evaluation Summary**: Accuracy percentage estimates and move breakdown grid displayed at the start position (ply 0).
- **URL & History Synchronization**: Query parameters (`?game=<id>&ply=<n>`) sync with state, supporting page refreshes and browser back/forward buttons (`popstate`).
- **Keyboard Navigation**: Navigate replay using `ArrowLeft`, `ArrowRight`, `Home`, and `End` keys with active move auto-scrolling.
- **Generic Review Domain Abstraction**: Designed with a clean adapter layer (`GenericReviewItem`) so the same review shell can host BlankSage student assessment feedback in the future.

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation & Run

```bash
# Install dependencies
npm.cmd install

# Start development server
npm.cmd run dev

# Run unit tests
npm.cmd test

# Run production build
npm.cmd run build
```

*Note: On Windows PowerShell, use `npm.cmd` as shown above.*

## Architecture & Code Structure

- `src/lib/review/types.ts`: Domain models for chess games, frames, moves, generic review items, and game summary statistics.
- `src/lib/review/timeline.ts`: Deterministic FEN timeline generator using `chess.js`.
- `src/lib/review/adapter.ts`: Transformation helpers mapping chess moves to `GenericReviewItem` structures and computing game summaries.
- `src/lib/review/demo-game.ts`: Game registry containing annotated game fixtures and lookup utilities.
- `src/components/game-review/chess-pieces.tsx`: Vector SVG chess piece components.
- `src/components/game-review/game-review-client.tsx`: Main interactive review replay shell, board, move list, summary panel, and controls.
- `src/app/globals.css`: Custom responsive styling, board grid, move chips, and dark insight panel.

## Process & Documentation

Detailed process artifacts and architectural design decisions live in `docs/process`:
- [`architecture.md`](file:///C:/Users/Admin/Documents/ChatGPT/blanksage/docs/process/architecture.md): Overview of domain abstraction and presentation separation.
- [`retrospective.md`](file:///C:/Users/Admin/Documents/ChatGPT/blanksage/docs/process/retrospective.md): Engineering priorities, trade-off rationale, and future extensions.
- [`ai-handoff-and-decisions.md`](file:///C:/Users/Admin/Documents/ChatGPT/blanksage/docs/process/ai-handoff-and-decisions.md): AI usage, decision log, and verification records.

## Assumptions

- Precomputed annotated review timelines are used to provide rich, instant explanations instead of running a live engine WebWorker.
- The review shell maps domain objects to generic review items to prepare for future BlankSage evaluation extensions.
