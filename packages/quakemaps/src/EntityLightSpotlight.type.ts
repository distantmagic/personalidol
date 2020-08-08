import type { Vector3Simple } from "./Vector3Simple.type";

export type EntityLightSpotlight = {
  readonly classname: "light_spotlight";
  readonly color: string;
  readonly decay: number;
  readonly intensity: number;
  readonly origin: Vector3Simple;
  readonly transferables: [];
};
