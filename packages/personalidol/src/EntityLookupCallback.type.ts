import type { Texture as ITexture } from "three";

import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityLookup } from "./EntityLookup.type";

export type EntityLookupCallback<K extends keyof EntityLookup> = (entity: EntityLookup[K], worldspawnTexture: ITexture, targetedViews: Set<View>) => View;
