import type { Pass } from "three/examples/jsm/postprocessing/Pass";
import type { Camera, Vector2, Object3D, Scene, Texture } from "three";

declare module "three/examples/jsm/postprocessing/OutlinePass" {
  declare export interface OutlinePass extends Pass {
    edgeGlow: number;
    edgeStrength: number;
    edgeThickness: number;
    hiddenEdgeColor: Vector3;
    patternTexture: ?Texture;
    pulsePeriod: number;
    selectedObjects: Array<Object3D>;
    usePatternTexture: boolean;
    visibleEdgeColor: Vector3;

    constructor(
      // [width, height]
      resolution: Vector2,
      Scene,
      Camera,
      selectedObjects?: Array<Object3D>
    ): void;

    dispose(): void;
  }
}
