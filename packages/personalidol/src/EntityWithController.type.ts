import type { AnyEntity } from "./AnyEntity.type";

export type EntityWithController = AnyEntity & {
  properties: {
    controller: string;
  };
};
