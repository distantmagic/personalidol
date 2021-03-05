import type { Entity } from "./Entity.type";

export type EntityLightHemisphere = Entity & {
  readonly classname: "light_hemisphere";
  readonly light: number;
};
