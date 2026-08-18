# Architecture Notes

## Product Shape

The app is organized around one review timeline:

- a completed chess game is loaded up front
- every move has an associated classification and short explanation
- the board, selected move, and feedback panel all read from the same selected ply

## Data Flow

1. The game seed lives in `src/lib/review/demo-game.ts`.
2. `buildReviewTimeline` converts SAN moves into a deterministic board timeline.
3. `GameReviewClient` renders the selected frame and keeps the UI in sync.
4. Navigation updates a single selected ply value, which drives the entire shell.

## Why This Shape

This mirrors the brief's maintainability requirement:

- the chess domain is isolated from presentation
- the review shell can later host BlankSage evaluation items instead of chess moves
- the move list, board, and explanation panel are all independent views over the same state

## Planned Extension Points

- multiple review fixtures
- imported PGN files
- stronger keyboard shortcuts
- evaluation summaries or engine-backed analysis
- future replacement of chess moves with assessment questions
