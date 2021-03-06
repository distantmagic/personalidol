export function must<T>(item: undefined | null | T, errorMessage: string = "Expected item to be not-null."): T {
  if (null === item || "undefined" === typeof item) {
    throw new Error(errorMessage);
  }

  return item;
}
