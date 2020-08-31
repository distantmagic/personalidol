import { HASH_START_CHAR, SUBROUTE_DELIMITER } from "./constants";

export function hashJoinSubRoutes(subroutes: ReadonlyArray<string>): string {
  return HASH_START_CHAR + subroutes.join(SUBROUTE_DELIMITER);
}
