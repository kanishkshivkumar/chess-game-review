# Retrospective & Engineering Trade-offs

## What Was Prioritized

1. **Core Review Experience Polish**:
   - Building a responsive, accessible, and synchronized Chess.com-style replay interface.
   - Vector SVG piece rendering to eliminate font dependency and visual inconsistency across operating systems.
   - Non-color classification indicators (`✓`, `👍`, `?!`, `?`, `??`) and WCAG-compliant focus states.

2. **Domain Architecture & Adaptability**:
   - Creating a clear boundary between the chess domain and the generic review shell (`GenericReviewItem`, `toGenericReviewItem`, `calculateGameSummary`).
   - Supporting multiple annotated games (Blackburne Shilling Trap, Morphy's Opera Game, Scholar's Mate) with URL parameter state sync (`?game=<id>&ply=<n>`) and browser `popstate` history handling.

3. **User Interaction & Keyboard Accessibility**:
   - Seamless keyboard controls (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
   - Auto-scrolling active move chip into view during replay.
   - Game summary accuracy breakdown panel presented at the start position (ply 0).

## Biggest Engineering & Product Trade-off

**Precomputed Review Data vs. Live Stockfish Engine Pipeline**:
- *Decision*: We prioritized a precomputed, annotated review timeline with rich explanations over a real-time Stockfish WebWorker integration.
- *Rationale*: The PRD explicitly emphasized product thinking, user experience, clean state management, and architecture over engine infrastructure. Precomputed data allows deterministic, instant load times, rich hand-crafted educational explanations, and a clean domain model that easily maps to BlankSage student evaluation items.

## Future Improvements & Next Steps

If given additional time:
1. **Interactive Chessboard Moves**: Allow users to make alternative moves on the board to explore "what-if" variations off the main review line.
2. **WebWorker Engine Analysis**: Add an optional Stockfish WebWorker to evaluate custom imported PGN files dynamically.
3. **Sound & Haptic Feedback**: Add subtle audio cues for piece moves, checks, and blunders to match the tactile Chess.com experience.
4. **BlankSage Assessment Mode**: Create a toggle demonstrating the exact same review shell rendering student coding or math assessment questions instead of chess moves.
