import { buildReviewTimeline } from "./timeline";
import type { ReviewGameSeed, ReviewTimeline } from "./types";

export const blackburneShillingTrapGame: ReviewGameSeed = {
  id: "blackburne-shilling-trap",
  title: "Blackburne Shilling Trap",
  white: "Adrian Vale",
  black: "Noah Mercer",
  result: "0-1",
  opening: "Italian Game",
  narrative:
    "A miniature review showing how an early greedy knight jump creates tactical vulnerabilities around the king and queen.",
  moves: [
    {
      san: "e4",
      classification: "best",
      explanation: "White claims the center immediately and opens lines for piece development.",
      evalScore: 0.3,
      learningCategory: "Opening Principle",
    },
    {
      san: "e5",
      classification: "best",
      explanation: "Black mirrors central control and retains harmony.",
      evalScore: 0.3,
      learningCategory: "Opening Principle",
    },
    {
      san: "Nf3",
      classification: "best",
      explanation: "Develops with tempo while preparing kingside castling.",
      evalScore: 0.4,
      learningCategory: "Opening Principle",
    },
    {
      san: "Nc6",
      classification: "best",
      explanation: "Defends e5 solidly while developing a knight.",
      evalScore: 0.3,
      learningCategory: "Opening Principle",
    },
    {
      san: "Bc4",
      classification: "best",
      explanation: "Targeting the weak f7 square in classical Italian Game style.",
      evalScore: 0.4,
      learningCategory: "Opening Principle",
    },
    {
      san: "Nd4",
      classification: "mistake",
      explanation: "A tricky knight move that breaks opening principles by moving the same piece twice.",
      evalScore: 1.6,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Nxe5",
      classification: "good",
      explanation: "White accepts the challenge and grabs the e5 pawn, opening the center for Black's counter attack.",
      evalScore: -1.2,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Qg5",
      classification: "best",
      explanation: "Black counter-attacks g2 and e5 simultaneously with queen pressure.",
      evalScore: -3.4,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Nxf7",
      classification: "mistake",
      explanation: "Greedy fork on f7 that misses Black's devastating counter-threat on g2.",
      evalScore: -6.8,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Qxg2",
      classification: "best",
      explanation: "Black attacks the rook on h1 and threatens checkmate setups.",
      evalScore: -8.5,
      learningCategory: "Finishing Tactic",
    },
    {
      san: "Rf1",
      classification: "good",
      explanation: "Forced rook defense, leaving the White king completely stranded.",
      evalScore: -9.2,
      learningCategory: "Defensive Priority",
    },
    {
      san: "Qxe4+",
      classification: "best",
      explanation: "Checks the king and forces White to block with the bishop.",
      evalScore: -10,
      isMate: true,
      learningCategory: "Finishing Tactic",
    },
    {
      san: "Be2",
      classification: "good",
      explanation: "Only legal block, but leaves White vulnerable to a suffocating smothered mate.",
      evalScore: -10,
      isMate: true,
      learningCategory: "Defensive Priority",
    },
    {
      san: "Nf3#",
      classification: "best",
      explanation: "Smothered checkmate! The knight delivers mate while White's king is trapped by its own pieces.",
      evalScore: -100,
      isMate: true,
      learningCategory: "Finishing Tactic",
    },
  ],
};

export const operaGame: ReviewGameSeed = {
  id: "opera-game",
  title: "Morphy's Opera Game",
  white: "Paul Morphy",
  black: "Duke Karl & Count Isouard",
  result: "1-0",
  opening: "Philidor Defense",
  narrative:
    "A legendary masterpiece of rapid piece development, open lines, and a spectacular queen sacrifice leading to checkmate.",
  moves: [
    { san: "e4", classification: "best", explanation: "Controls the center and opens diagonals.", evalScore: 0.3, learningCategory: "Opening Principle" },
    { san: "e5", classification: "best", explanation: "Establishes central pawn presence.", evalScore: 0.3, learningCategory: "Opening Principle" },
    { san: "Nf3", classification: "best", explanation: "Develops knight toward center while threatening e5.", evalScore: 0.4, learningCategory: "Opening Principle" },
    { san: "d6", classification: "good", explanation: "The Philidor Defense: solid but passive.", evalScore: 0.6, learningCategory: "Opening Principle" },
    { san: "d4", classification: "best", explanation: "Strikes immediately at Black's center.", evalScore: 0.8, learningCategory: "Opening Principle" },
    { san: "Bg4", classification: "inaccuracy", explanation: "Pins the knight, but surrenders bishop pair prematurely.", evalScore: 1.2, learningCategory: "Tactical Trap Alert" },
    { san: "dxe5", classification: "best", explanation: "Opens lines to exploit Black's uncoordinated pieces.", evalScore: 1.5, learningCategory: "Tactical Trap Alert" },
    { san: "Bxf3", classification: "mistake", explanation: "Giving up the light-squared bishop gives White strong diagonals.", evalScore: 2.1, learningCategory: "Tactical Trap Alert" },
    { san: "Qxf3", classification: "best", explanation: "Recaptures with queen, developing another attacking unit.", evalScore: 2.2, learningCategory: "Opening Principle" },
    { san: "dxe5", classification: "good", explanation: "Recaptures the central pawn.", evalScore: 2.2, learningCategory: "Opening Principle" },
    { san: "Bc4", classification: "best", explanation: "Develops bishop targeting f7 with threat of mate.", evalScore: 2.8, learningCategory: "Tactical Trap Alert" },
    { san: "Nf6", classification: "good", explanation: "Defends against immediate mate on f7.", evalScore: 2.5, learningCategory: "Defensive Priority" },
    { san: "Qb3", classification: "best", explanation: "Double attack on b7 and f7 squares.", evalScore: 3.4, learningCategory: "Tactical Trap Alert" },
    { san: "Qe7", classification: "good", explanation: "Defends f7 while leaving b7 vulnerable.", evalScore: 3.2, learningCategory: "Defensive Priority" },
    { san: "Nc3", classification: "best", explanation: "Prioritizes rapid development over pawn grabbing.", evalScore: 3.8, learningCategory: "Opening Principle" },
    { san: "c6", classification: "good", explanation: "Defends b5 square and protects b7 pawn.", evalScore: 3.6, learningCategory: "Defensive Priority" },
    { san: "Bg5", classification: "best", explanation: "Pins the knight on f6, neutralizing Black's defender.", evalScore: 4.2, learningCategory: "Tactical Trap Alert" },
    { san: "b5", classification: "mistake", explanation: "Desperate pawn push attempting to drive back White's bishop.", evalScore: 6.5, learningCategory: "Tactical Trap Alert" },
    { san: "Nxb5", classification: "best", explanation: "Brilliant piece sacrifice to smash open the Black king's position!", evalScore: 7.2, learningCategory: "Finishing Tactic" },
    { san: "cxb5", classification: "good", explanation: "Accepts the sacrifice, but opens the a-file for White.", evalScore: 7.5, learningCategory: "Defensive Priority" },
    { san: "Bxb5+", classification: "best", explanation: "Gives check and keeps Black under heavy tactical assault.", evalScore: 8.0, learningCategory: "Finishing Tactic" },
    { san: "Nbd7", classification: "good", explanation: "Blocks the check, but Black is heavily pinned.", evalScore: 8.2, learningCategory: "Defensive Priority" },
    { san: "O-O-O", classification: "best", explanation: "Castles queenside, bringing the rook into play with tempo!", evalScore: 9.0, learningCategory: "Opening Principle" },
    { san: "Rd8", classification: "good", explanation: "Attempts to reinforce the pinned knight on d7.", evalScore: 8.8, learningCategory: "Defensive Priority" },
    { san: "Rxd7", classification: "best", explanation: "Exchange sacrifice to eliminate Black's defensive anchor!", evalScore: 9.8, learningCategory: "Finishing Tactic" },
    { san: "Rxd7", classification: "good", explanation: "Recaptures with rook.", evalScore: 9.8, learningCategory: "Defensive Priority" },
    { san: "Rd1", classification: "best", explanation: "Brings the final rook into action, dominating the d-file.", evalScore: 10.0, learningCategory: "Finishing Tactic" },
    { san: "Qe6", classification: "inaccuracy", explanation: "Attempts to offer queen trade, but it comes too late.", evalScore: 10.0, isMate: true, learningCategory: "Tactical Trap Alert" },
    { san: "Bxd7+", classification: "best", explanation: "Captures on d7 with check.", evalScore: 10.0, isMate: true, learningCategory: "Finishing Tactic" },
    { san: "Nxd7", classification: "good", explanation: "Recaptures with knight.", evalScore: 10.0, isMate: true, learningCategory: "Defensive Priority" },
    { san: "Qb8+", classification: "best", explanation: "Spectacular queen sacrifice forcing Black's knight away from d7!", evalScore: 10.0, isMate: true, learningCategory: "Finishing Tactic" },
    { san: "Nxb8", classification: "good", explanation: "Forced capture of the queen.", evalScore: 10.0, isMate: true, learningCategory: "Defensive Priority" },
    { san: "Rd8#", classification: "best", explanation: "Checkmate! Rook delivers mate down the open d-file supported by the bishop.", evalScore: 100.0, isMate: true, learningCategory: "Finishing Tactic" },
  ],
};

export const scholarsMateGame: ReviewGameSeed = {
  id: "scholars-mate",
  title: "Scholar's Mate",
  white: "Elena Vance",
  black: "Marcus Reed",
  result: "1-0",
  opening: "King's Pawn Opening",
  narrative:
    "A rapid 4-move miniature demonstrating early tactical aggression against the vulnerable f7 square.",
  moves: [
    {
      san: "e4",
      classification: "best",
      explanation: "Standard king's pawn opening controlling central squares.",
      evalScore: 0.3,
      learningCategory: "Opening Principle",
    },
    {
      san: "e5",
      classification: "best",
      explanation: "Black responds symmetrically in the center.",
      evalScore: 0.3,
      learningCategory: "Opening Principle",
    },
    {
      san: "Qh5",
      classification: "inaccuracy",
      explanation: "Early queen attack aiming for quick tactics, but exposing the queen early.",
      evalScore: 0.2,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Nc6",
      classification: "best",
      explanation: "Solid defense of e5 while developing a knight.",
      evalScore: 0.1,
      learningCategory: "Opening Principle",
    },
    {
      san: "Bc4",
      classification: "best",
      explanation: "Bishop lines up on f7, setting up a battery with the queen.",
      evalScore: 1.2,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Nf6",
      classification: "blunder",
      explanation: "Natural development move that completely overlooks the checkmate threat on f7!",
      evalScore: 10.0,
      isMate: true,
      learningCategory: "Tactical Trap Alert",
    },
    {
      san: "Qxf7#",
      classification: "best",
      explanation: "Scholar's Mate! Queen captures on f7 supported by bishop for instant checkmate.",
      evalScore: 100.0,
      isMate: true,
      learningCategory: "Finishing Tactic",
    },
  ],
};

export const ALL_GAMES: ReviewGameSeed[] = [
  blackburneShillingTrapGame,
  operaGame,
  scholarsMateGame,
];

export const DEFAULT_GAME_ID = blackburneShillingTrapGame.id;

export const GAMES_MAP: Record<string, ReviewGameSeed> = Object.fromEntries(
  ALL_GAMES.map((game) => [game.id, game]),
);

export const REVIEW_TIMELINES_MAP: Record<string, ReviewTimeline> = Object.fromEntries(
  ALL_GAMES.map((game) => [game.id, buildReviewTimeline(game)]),
);

export const reviewTimeline = REVIEW_TIMELINES_MAP[DEFAULT_GAME_ID];

export function registerCustomGame(gameSeed: ReviewGameSeed): ReviewTimeline {
  GAMES_MAP[gameSeed.id] = gameSeed;
  const timeline = buildReviewTimeline(gameSeed);
  REVIEW_TIMELINES_MAP[gameSeed.id] = timeline;

  if (!ALL_GAMES.some((g) => g.id === gameSeed.id)) {
    ALL_GAMES.unshift(gameSeed);
  }

  return timeline;
}

export function getGameTimeline(gameId?: string | null): ReviewTimeline {
  if (!gameId || !(gameId in REVIEW_TIMELINES_MAP)) {
    return REVIEW_TIMELINES_MAP[DEFAULT_GAME_ID];
  }
  return REVIEW_TIMELINES_MAP[gameId];
}
