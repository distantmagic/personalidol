import type { Entity } from "./Entity.type";

export type EntityLightAmbient = Entity & {
  readonly classname: "light_ambient";
  readonly light: number;
};
