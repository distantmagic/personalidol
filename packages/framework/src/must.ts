export function must<T>(item: null | T, errorMessage: string = ""): T {
  if (null === item) {
    throw new Error(errorMessage);
  }

  return item;
}
