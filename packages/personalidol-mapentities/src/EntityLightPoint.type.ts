import type { Vector3Simple } from "@personalidol/quakemaps/src/Vector3Simple.type";

export type EntityLightPoint = {
  readonly classname: "light_point";
  readonly color: string;
  readonly decay: number;
  readonly intensity: number;
  readonly origin: Vector3Simple;
  readonly transferables: [];
};
