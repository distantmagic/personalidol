import type { Texture as ITexture } from "three";

import type { EntityLookup } from "./EntityLookup.type";
import type { EntityView } from "./EntityView.interface";

export type EntityLookupCallback<K extends keyof EntityLookup> = (entity: EntityLookup[K], worldspawnTexture: ITexture, targetedViews: Set<EntityView>) => EntityView;
