import type { EntityLight } from "./EntityLight.type";

export type EntityLightPoint = EntityLight & {
  readonly classname: "light_point";
};
