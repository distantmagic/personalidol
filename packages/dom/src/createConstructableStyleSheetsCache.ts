import type { ConstructableStyleSheetsCache } from "./ConstructableStyleSheetsCache.type";

export function createConstructableStyleSheetsCache(): ConstructableStyleSheetsCache {
  // Might be something else potentially. Currently it's good enough, but
  // making changes from just plain object would not require changes in the
  // code that uses this package.
  return {};
}
