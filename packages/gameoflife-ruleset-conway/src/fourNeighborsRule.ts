export function fourNeighborsRule(cell: number, neighbors: number): number {
  if (neighbors > 3) {
    return 0;
  }

  return cell;
}
