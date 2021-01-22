import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { PollablePreloadingState } from "./PollablePreloadingState.interface";
import type { ViewBag } from "./ViewBag.interface";

export interface ViewBagScene extends PollablePreloadingState, Scene {
  readonly isViewBagScene: true;
  readonly scene: Scene;
  readonly viewBag: ViewBag;
}
