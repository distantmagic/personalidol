import type { AnyEntity } from "./AnyEntity.type";

export type TargetedEntity = AnyEntity & {
  properties: {
    targetname: string;
  };
};
