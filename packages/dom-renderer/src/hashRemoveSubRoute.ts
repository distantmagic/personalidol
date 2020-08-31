import { hashJoinSubRoutes } from "./hashJoinSubRoutes";
import { hashSplitToSubRoutes } from "./hashSplitToSubRoutes";

export function hashRemoveSubRoute(hash: string, remove: string): string {
  const subroutes = hashSplitToSubRoutes(hash).sort();

  if (!subroutes.includes(remove)) {
    throw new Error(`Hash "${hash}" does not contain subroute: "${remove}"`);
  }

  return hashJoinSubRoutes(
    subroutes.filter(function (subroute: string) {
      return subroute !== remove;
    })
  );
}
