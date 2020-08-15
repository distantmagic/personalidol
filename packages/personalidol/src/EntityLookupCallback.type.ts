import type { Texture as ITexture } from "three";

import type { EntityLookup } from "@personalidol/quakemaps/src/EntityLookup.type";

export type EntityLookupCallback<K extends keyof EntityLookup> = (entity: EntityLookup[K], worldspawnTexture: ITexture) => void | Promise<void>;
