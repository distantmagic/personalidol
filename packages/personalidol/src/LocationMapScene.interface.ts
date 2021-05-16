import type { PollablePreloading } from "@personalidol/framework/src/PollablePreloading.interface";
import type { Scene } from "@personalidol/framework/src/Scene.interface";

export interface LocationMapScene extends PollablePreloading, Scene {
  readonly currentMap: string;
  readonly isLocationMapScene: true;
}
