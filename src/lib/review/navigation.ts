export function clampPly(ply: number, totalPlies: number): number {
  if (!Number.isFinite(ply)) {
    return 0;
  }

  const rounded = Math.trunc(ply);
  return Math.max(0, Math.min(totalPlies, rounded));
}

export function goToPreviousPly(currentPly: number): number {
  return Math.max(0, currentPly - 1);
}

export function goToNextPly(currentPly: number, totalPlies: number): number {
  return Math.min(totalPlies, currentPly + 1);
}

export function formatPlyLabel(ply: number): string {
  if (ply === 0) {
    return "Start position";
  }

  const moveNumber = Math.floor((ply - 1) / 2) + 1;
  const sideSuffix = ply % 2 === 1 ? "." : "...";
  return `Move ${moveNumber}${sideSuffix}`;
}
