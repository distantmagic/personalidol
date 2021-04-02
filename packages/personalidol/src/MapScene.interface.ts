import type { Scene } from "@personalidol/framework/src/Scene.interface";

export interface MapScene extends Scene {
  readonly currentMap: string;
  readonly isMapScene: true;
}
