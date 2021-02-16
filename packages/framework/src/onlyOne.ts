import { first } from "./first";
import { must } from "./must";

export function onlyOne<T>(items: Set<T>, message: string = "Expected exactly one item in set."): T {
  if (items.size !== 1) {
    throw new Error(message);
  }

  return must(first(items), message);
}
