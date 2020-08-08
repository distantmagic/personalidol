import type { Vector3Simple } from "./Vector3Simple.type";

export type EntityGLTFModel = {
  readonly angle: number;
  readonly classname: "model_gltf";
  readonly model_name: string;
  readonly model_texture: string;
  readonly origin: Vector3Simple;
  readonly scale: number;
  readonly transferables: [];
};
