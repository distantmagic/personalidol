import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityGLTFModel = BaseEntity & {
  readonly angle: number;
  readonly classname: "model_gltf";
  readonly model_name: string;
  readonly model_texture: string;
  readonly origin: Vector3Simple;
  readonly scale: number;
};
