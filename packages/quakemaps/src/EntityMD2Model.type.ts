import type { Vector3Simple } from "./Vector3Simple.type";

export type EntityMD2Model = {
  readonly angle: number;
  readonly classname: "model_md2";
  readonly model_name: string;
  readonly origin: Vector3Simple;
  readonly skin: number;
  readonly transferables: [];
};
