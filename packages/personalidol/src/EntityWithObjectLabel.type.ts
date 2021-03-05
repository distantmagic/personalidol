import type { AnyEntity } from "./AnyEntity.type";

export type EntityWithObjectLabel = AnyEntity & {
  properties: {
    label: string;
  };
};
