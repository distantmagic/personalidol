import type { EntityAny } from "./EntityAny.type";

export type TargetingEntity = EntityAny & {
  properties: {
    target: string;
  };
};
