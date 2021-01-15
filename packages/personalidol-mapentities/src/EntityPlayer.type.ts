import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

export type EntityPlayer = {
  readonly classname: "player";
  readonly origin: Vector3Simple;
  readonly transferables: [];
};
