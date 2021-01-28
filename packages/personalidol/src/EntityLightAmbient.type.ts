import type { BaseEntity } from "./BaseEntity.type";

export type EntityLightAmbient = BaseEntity & {
  readonly classname: "light_ambient";
  readonly light: number;
};
