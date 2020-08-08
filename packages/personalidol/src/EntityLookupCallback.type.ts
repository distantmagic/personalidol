import type { EntityLookup } from "@personalidol/quakemaps/src/EntityLookup.type";

export type EntityLookupCallback<K extends keyof EntityLookup> = (entity: EntityLookup[K]) => void | Promise<void>;
