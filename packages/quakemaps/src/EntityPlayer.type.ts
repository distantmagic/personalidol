import type { Vector3Simple } from "./Vector3Simple.type";

export type EntityPlayer = {
  readonly classname: "player";
  readonly origin: Vector3Simple;
  readonly transferables: [];
};
