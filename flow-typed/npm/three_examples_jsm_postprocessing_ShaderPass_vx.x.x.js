import type { Pass } from "three/examples/jsm/postprocessing/Pass";
import type { Shader, ShaderMaterial } from "three";

declare module "three/examples/jsm/postprocessing/ShaderPass" {
  declare export interface ShaderPass extends Pass {
    constructor(Shader | ShaderMaterial, textureID: number | string): void;
  }
}
