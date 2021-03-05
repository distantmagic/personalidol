import type { EntityLight } from "./EntityLight.type";

export type EntityLightSpotlight = EntityLight & {
  readonly classname: "light_spotlight";
};
