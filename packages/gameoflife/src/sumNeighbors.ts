export function sumNeighbors(height: number, width: number, input: ReadonlyArray<number>, index: number): number {
  const currentRow = Math.floor(index / width);

  const sameRowMin = currentRow * width;
  const sameRowMax = sameRowMin + width - 1;

  let sum = 0;

  // above row
  if (currentRow > 0) {
    const aboveRowMin = sameRowMin - width;
    const aboveRowMax = sameRowMax - width;

    for (let indexAbove of [index - width - 1, index - width, index - width + 1]) {
      if (indexAbove >= aboveRowMin && indexAbove <= aboveRowMax) {
        sum += input[indexAbove] || 0;
      }
    }
  }

  // same row
  for (let indexSame of [index - 1, index + 1]) {
    if (indexSame >= sameRowMin && indexSame <= sameRowMax) {
      sum += input[indexSame] || 0;
    }
  }

  // below row
  if (currentRow < height - 1) {
    const belowRowMin = sameRowMin + width;
    const belowRowMax = sameRowMax + width;

    for (let indexBelow of [index + width - 1, index + width, index + width + 1]) {
      if (indexBelow >= belowRowMin && indexBelow <= belowRowMax) {
        sum += input[indexBelow] || 0;
      }
    }
  }

  return sum;
}
