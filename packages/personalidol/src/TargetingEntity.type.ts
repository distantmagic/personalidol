import type { AnyEntity } from "./AnyEntity.type";

export type TargetingEntity = AnyEntity & {
  properties: {
    target: string;
  };
};
