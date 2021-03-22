import type { ViewBaggableScene } from "@personalidol/views/src/ViewBaggableScene.interface";

export interface MapScene extends ViewBaggableScene {
  readonly currentMap: string;
  readonly isMapScene: true;
}
