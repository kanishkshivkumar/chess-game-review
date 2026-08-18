import { buildReviewTimeline } from "./timeline";
import type { ReviewGameSeed } from "./types";

export const reviewGameSeed: ReviewGameSeed = {
  id: "blackburne-shilling-trap",
  title: "Blackburne Shilling Trap",
  white: "Adrian Vale",
  black: "Noah Mercer",
  result: "0-1",
  opening: "Italian Game",
  narrative:
    "A miniature review that shows how one greedy knight move opens the king and converts the rest of the board into a tactical puzzle.",
  moves: [
    {
      san: "e4",
      classification: "best",
      explanation: "White claims the center immediately and keeps the position open for development.",
    },
    {
      san: "e5",
      classification: "best",
      explanation: "Black mirrors the central claim and stays in the main channel of the opening.",
    },
    {
      san: "Nf3",
      classification: "best",
      explanation: "Developing with tempo and preparing a quick castle keeps White's king safe.",
    },
    {
      san: "Nc6",
      classification: "best",
      explanation: "Black supports the e5 pawn and develops a piece instead of reaching for tactics too early.",
    },
    {
      san: "Bc4",
      classification: "best",
      explanation: "The bishop eyes f7 and pressures the weak point in Black's position.",
    },
    {
      san: "Nd4",
      classification: "mistake",
      explanation: "This knight jump looks active, but it ignores development and creates tactical weaknesses around the queen and king.",
    },
    {
      san: "Nxe5",
      classification: "good",
      explanation: "White accepts the challenge and grabs the e5 pawn while staying active.",
    },
    {
      san: "Qg5",
      classification: "mistake",
      explanation: "The queen sortie tries to punish White immediately, but it also drags the queen into the attack without enough support.",
    },
    {
      san: "Nxf7",
      classification: "best",
      explanation: "White uses the fork on f7 to open the king and create a forcing line.",
    },
    {
      san: "Qxg2",
      classification: "best",
      explanation: "Black grabs a pawn and keeps the attack alive, but the king safety problem is now impossible to ignore.",
    },
    {
      san: "Rf1",
      classification: "best",
      explanation: "White defends, keeps the rook active, and leaves the king with enough breathing room.",
    },
    {
      san: "Qxe4+",
      classification: "blunder",
      explanation: "The check looks energetic, but it hands White more time to coordinate the defense and does not solve the attack.",
    },
    {
      san: "Be2",
      classification: "best",
      explanation: "White covers the king, connects the pieces, and stays calm under pressure.",
    },
    {
      san: "Nf3#",
      classification: "best",
      explanation: "The final knight lands on f3 with checkmate. White's development lead turns the exposed king into a finished tactic.",
    },
  ],
};

export const reviewTimeline = buildReviewTimeline(reviewGameSeed);
