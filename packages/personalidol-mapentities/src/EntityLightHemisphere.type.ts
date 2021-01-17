import type { BaseEntity } from "./BaseEntity.type";

export type EntityLightHemisphere = BaseEntity & {
  readonly classname: "light_hemisphere";
  readonly light: number;
};
