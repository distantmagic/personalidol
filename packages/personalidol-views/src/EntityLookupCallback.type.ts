import type { Texture as ITexture } from "three";

import type { EntityLookup } from "@personalidol/personalidol-mapentities/src/EntityLookup.type";
import type { View } from "@personalidol/framework/src/View.interface";

export type EntityLookupCallback<K extends keyof EntityLookup> = (entity: EntityLookup[K], worldspawnTexture: ITexture, targetedViews: Set<View>) => View;
