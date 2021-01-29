import type { EntityAny } from "./EntityAny.type";

export type EntityWithObjectLabel = EntityAny & {
  properties: {
    label: string;
  };
};
