import type { Pass } from "three/examples/jsm/postprocessing/Pass";
import type { Camera, Material, Scene, Vector3 } from "three";

declare module "three/examples/jsm/postprocessing/RenderPass" {
  declare export interface RenderPass extends Pass {
    constructor(Scene, Camera, overrideMaterial?: Material, clearColor?: Vector3, clearAlpha?: Vector3): void;
  }
}
