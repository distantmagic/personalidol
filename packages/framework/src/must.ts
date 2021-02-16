export function must<T>(item: null | T, errorMessage: string = "Expected item to be not-null."): T {
  if (null === item) {
    throw new Error(errorMessage);
  }

  return item;
}
