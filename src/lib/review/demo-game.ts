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
    },
    {
      san: "e5",
      classification: "best",
      explanation: "Black mirrors central control and retains harmony.",
    },
    {
      san: "Nf3",
      classification: "best",
      explanation: "Developing with tempo while preparing kingside castling.",
    },
    {
      san: "Nc6",
      classification: "best",
      explanation: "Defends e5 solidly while developing a knight.",
    },
    {
      san: "Bc4",
      classification: "best",
      explanation: "Targeting the weak f7 square in classical Italian Game style.",
    },
    {
      san: "Nd4",
      classification: "mistake",
      explanation: "A tricky knight move that breaks opening principles by moving the same piece twice.",
    },
    {
      san: "Nxe5",
      classification: "good",
      explanation: "White takes the bait on e5, opening the center for Black's tactical counter attack.",
    },
    {
      san: "Qg5",
      classification: "best",
      explanation: "Black counter-attacks g2 and e5 simultaneously with queen pressure.",
    },
    {
      san: "Nxf7",
      classification: "mistake",
      explanation: "Greedy fork on f7 that misses Black's devastating counter-threat on g2.",
    },
    {
      san: "Qxg2",
      classification: "best",
      explanation: "Black attacks the rook on h1 and threatens checkmate setups.",
    },
    {
      san: "Rf1",
      classification: "good",
      explanation: "Forced rook defense, leaving the White king completely stranded.",
    },
    {
      san: "Qxe4+",
      classification: "best",
      explanation: "Checks the king and forces White to block with the bishop.",
    },
    {
      san: "Be2",
      classification: "good",
      explanation: "Only legal block, but leaves White vulnerable to a suffocating smothered mate.",
    },
    {
      san: "Nf3#",
      classification: "best",
      explanation: "Smothered checkmate! The knight delivers mate while White's king is trapped by its own pieces.",
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
    { san: "e4", classification: "best", explanation: "Controls the center and opens diagonals for bishop and queen." },
    { san: "e5", classification: "best", explanation: "Establishes central pawn presence." },
    { san: "Nf3", classification: "best", explanation: "Develops knight toward center while threatening e5." },
    { san: "d6", classification: "good", explanation: "The Philidor Defense: solid but passive for Black." },
    { san: "d4", classification: "best", explanation: "Strikes immediately at Black's center." },
    { san: "Bg4", classification: "inaccuracy", explanation: "Pins the knight, but surrenders bishop pair prematurely." },
    { san: "dxe5", classification: "best", explanation: "Opens lines to exploit Black's uncoordinated pieces." },
    { san: "Bxf3", classification: "mistake", explanation: "Giving up the light-squared bishop gives White strong diagonals." },
    { san: "Qxf3", classification: "best", explanation: "Recaptures with queen, developing another attacking unit." },
    { san: "dxe5", classification: "good", explanation: "Recaptures the central pawn." },
    { san: "Bc4", classification: "best", explanation: "Develops bishop targeting f7 with threat of mate." },
    { san: "Nf6", classification: "good", explanation: "Defends against immediate mate on f7." },
    { san: "Qb3", classification: "best", explanation: "Double attack on b7 and f7 squares." },
    { san: "Qe7", classification: "good", explanation: "Defends f7 while leaving b7 vulnerable." },
    { san: "Nc3", classification: "best", explanation: "Prioritizes rapid development over pawn grabbing." },
    { san: "c6", classification: "good", explanation: "Defends b5 square and protects b7 pawn." },
    { san: "Bg5", classification: "best", explanation: "Pins the knight on f6, neutralizing Black's defender." },
    { san: "b5", classification: "mistake", explanation: "Desperate pawn push attempting to drive back White's bishop." },
    { san: "Nxb5", classification: "best", explanation: "Brilliant piece sacrifice to smash open the Black king's position!" },
    { san: "cxb5", classification: "good", explanation: "Accepts the sacrifice, but opens the a-file for White." },
    { san: "Bxb5+", classification: "best", explanation: "Gives check and keeps Black under heavy tactical assault." },
    { san: "Nbd7", classification: "good", explanation: "Blocks the check, but Black is heavily pinned." },
    { san: "O-O-O", classification: "best", explanation: "Castles queenside, bringing the rook into play with tempo!" },
    { san: "Rd8", classification: "good", explanation: "Attempts to reinforce the pinned knight on d7." },
    { san: "Rxd7", classification: "best", explanation: "Exchange sacrifice to eliminate Black's defensive anchor!" },
    { san: "Rxd7", classification: "good", explanation: "Recaptures with rook." },
    { san: "Rd1", classification: "best", explanation: "Brings the final rook into action, dominating the d-file." },
    { san: "Qe6", classification: "inaccuracy", explanation: "Attempts to offer queen trade, but it comes too late." },
    { san: "Bxd7+", classification: "best", explanation: "Captures on d7 with check." },
    { san: "Nxd7", classification: "good", explanation: "Recaptures with knight." },
    { san: "Qb8+", classification: "best", explanation: "Spectacular queen sacrifice forcing Black's knight away from d7!" },
    { san: "Nxb8", classification: "good", explanation: "Forced capture of the queen." },
    { san: "Rd8#", classification: "best", explanation: "Checkmate! Rook delivers mate down the open d-file supported by the bishop." },
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
    },
    {
      san: "e5",
      classification: "best",
      explanation: "Black responds symmetrically in the center.",
    },
    {
      san: "Qh5",
      classification: "inaccuracy",
      explanation: "Early queen attack aiming for quick tactics, but exposing the queen early.",
    },
    {
      san: "Nc6",
      classification: "best",
      explanation: "Solid defense of e5 while developing a knight.",
    },
    {
      san: "Bc4",
      classification: "best",
      explanation: "Bishop lines up on f7, setting up a battery with the queen.",
    },
    {
      san: "Nf6",
      classification: "blunder",
      explanation: "Natural development move that completely overlooks the checkmate threat on f7!",
    },
    {
      san: "Qxf7#",
      classification: "best",
      explanation: "Scholar's Mate! Queen captures on f7 supported by bishop for instant checkmate.",
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

export function getGameTimeline(gameId?: string | null): ReviewTimeline {
  if (!gameId || !(gameId in REVIEW_TIMELINES_MAP)) {
    return REVIEW_TIMELINES_MAP[DEFAULT_GAME_ID];
  }
  return REVIEW_TIMELINES_MAP[gameId];
}
