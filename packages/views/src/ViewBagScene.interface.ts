import type { PollablePreloadingState } from "@personalidol/framework/src/PollablePreloadingState.interface";
import type { Scene } from "@personalidol/framework/src/Scene.interface";

import type { ViewBag } from "./ViewBag.interface";
import type { ViewBaggableScene } from "./ViewBaggableScene.interface";

export interface ViewBagScene extends PollablePreloadingState, Scene {
  readonly isViewBagScene: true;
  readonly scene: ViewBaggableScene;
  readonly viewBag: ViewBag;
}
