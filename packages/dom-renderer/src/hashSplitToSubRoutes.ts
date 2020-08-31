import { HASH_START_CHAR, SUBROUTE_DELIMITER } from "./constants";

export function hashSplitToSubRoutes(hash: string): Array<string> {
  if (hash.length < 1) {
    return [];
  }

  if (!hash.startsWith(HASH_START_CHAR)) {
    throw new Error("Given hash does not start with a '#'.");
  }

  if (hash === HASH_START_CHAR) {
    return [];
  }

  return hash.substr(1).split(SUBROUTE_DELIMITER);
}
