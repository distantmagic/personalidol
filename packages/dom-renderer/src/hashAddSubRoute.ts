import { hashJoinSubRoutes } from "./hashJoinSubRoutes";
import { hashSplitToSubRoutes } from "./hashSplitToSubRoutes";

export function hashAddSubRoute(hash: string, add: string): string {
  const subroutes = hashSplitToSubRoutes(hash);

  if (subroutes.includes(add)) {
    throw new Error(`Hash "${hash}" alread includes subroute: "${add}"`);
  }

  subroutes.push(add);
  subroutes.sort();

  return hashJoinSubRoutes(subroutes);
}
