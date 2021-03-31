import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";

import type { Raycastable } from "./Raycastable.interface";

export type RaycasterState = MainLoopUpdatableState & {
  intersections: Set<Raycastable>;
  hasIntersections: boolean;
};
