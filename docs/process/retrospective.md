# Retrospective

## What I prioritized

- a synchronized review flow with a single source of truth for move selection
- a maintainable domain/presentation split so the shell can be repurposed later
- a readable, restrained interface with clear hierarchy and keyboard navigation

## What I would improve with more time

- add a second review fixture and a game selector
- introduce richer move annotations or engine-backed analysis
- add end-to-end coverage around keyboard navigation and URL persistence

## Biggest trade-off

I chose a precomputed review timeline instead of adding a live engine pipeline. That kept the product focused on the interaction model the brief emphasized and made the architecture easier to extend toward BlankSage-specific review items later.
