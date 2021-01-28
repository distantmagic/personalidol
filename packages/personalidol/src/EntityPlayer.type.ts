import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityPlayer = BaseEntity & {
  readonly classname: "player";
  readonly origin: Vector3Simple;
};
