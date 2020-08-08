export function threeNeighborsRule(cell: number, neighbors: number): number {
  if (neighbors === 3) {
    return 1;
  }

  return cell;
}
