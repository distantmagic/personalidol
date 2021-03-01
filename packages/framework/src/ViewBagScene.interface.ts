import type { PollablePreloadingState } from "./PollablePreloadingState.interface";
import type { Scene } from "./Scene.interface";
import type { ViewBag } from "./ViewBag.interface";

export interface ViewBagScene extends PollablePreloadingState, Scene {
  readonly isViewBagScene: true;
  readonly scene: Scene;
  readonly viewBag: ViewBag;
}
