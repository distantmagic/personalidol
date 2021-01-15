import type { EntityLookup } from "@personalidol/personalidol-mapentities/src/EntityLookup.type";

import type { EntityLookupCallback } from "./EntityLookupCallback.type";

export type EntityLookupTable = {
  [K in keyof EntityLookup]: EntityLookupCallback<K>;
};
