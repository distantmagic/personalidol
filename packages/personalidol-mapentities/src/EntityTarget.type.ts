import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityTarget = BaseEntity & {
  readonly classname: "target";
  readonly origin: Vector3Simple;
};
