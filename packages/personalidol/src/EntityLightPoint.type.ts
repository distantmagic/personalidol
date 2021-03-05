import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

import type { Entity } from "./Entity.type";

export type EntityLightPoint = Entity & {
  readonly classname: "light_point";
  readonly color: string;
  readonly decay: number;
  readonly intensity: number;
  readonly origin: Vector3Simple;
};
