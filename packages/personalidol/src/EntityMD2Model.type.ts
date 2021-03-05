import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { Entity } from "./Entity.type";

export type EntityMD2Model = Entity & {
  readonly angle: number;
  readonly classname: "model_md2";
  readonly model_name: string;
  readonly origin: Vector3Simple;
  readonly skin: number;
};
