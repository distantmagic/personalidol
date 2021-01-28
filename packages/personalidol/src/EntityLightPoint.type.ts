import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { BaseEntity } from "./BaseEntity.type";

export type EntityLightPoint = BaseEntity & {
  readonly classname: "light_point";
  readonly color: string;
  readonly decay: number;
  readonly intensity: number;
  readonly origin: Vector3Simple;
};
