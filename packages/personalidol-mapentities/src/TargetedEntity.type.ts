import type { EntityAny } from "./EntityAny.type";

export type TargetedEntity = EntityAny & {
  properties: {
    targetname: string;
  };
};
