export function oneNeighborRule(cell: number, neighbors: number): number {
  if (neighbors <= 1) {
    return 0;
  }

  return cell;
}
