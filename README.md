# BlankSage Review Replay

This repository contains a polished recreation of the core Chess.com Game Review flow, built as a small product instead of a throwaway demo.

## Status

The scaffold centers on:

- a single completed chess game
- a synchronized board, move list, and review panel
- precomputed move classifications and explanations
- URL-synced move selection
- keyboard navigation

## Setup

```bash
npm.cmd install
npm.cmd run dev
```

If your Windows shell blocks the `npm` PowerShell wrapper, use the `.cmd` form above from PowerShell or run the commands in `cmd.exe`.

## Scripts

- `npm.cmd run dev` - start the development server
- `npm.cmd run build` - create a production build
- `npm.cmd run start` - run the production build
- `npm.cmd test` - run the domain tests

## Architecture

- `src/lib/review` holds the domain model, timeline builder, and navigation helpers.
- `src/components/game-review` holds the presentation shell, board, move list, and review panel.
- `src/app` holds the Next.js app shell and global styles.

## Assumptions

- The assignment can be demonstrated with one predefined completed game.
- Review classifications are precomputed rather than derived from a live engine.
- The board state is derived from a timeline built from SAN moves.

## Process Notes

Design and implementation notes live in `docs/process`.
