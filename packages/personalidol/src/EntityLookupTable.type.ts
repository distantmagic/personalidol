import type { EntityLookup } from "./EntityLookup.type";
import type { EntityLookupCallback } from "./EntityLookupCallback.type";

export type EntityLookupTable = {
  [K in keyof EntityLookup]: EntityLookupCallback<K, EntityLookup[K]>;
};
