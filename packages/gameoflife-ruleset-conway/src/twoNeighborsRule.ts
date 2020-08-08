export function twoNeighborsRule(cell: number, neighbors: number): number {
  if (neighbors === 2 || neighbors === 3) {
    return cell;
  }

  return 0;
}
