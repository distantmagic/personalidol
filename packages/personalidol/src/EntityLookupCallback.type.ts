import type { Texture as ITexture } from "three";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityLookup } from "./EntityLookup.type";
import type { EntityView } from "./EntityView.interface";

export type EntityLookupCallback<K extends keyof EntityLookup, E extends EntityLookup[K] = EntityLookup[K]> = (
  entity: E,
  worldspawnTexture: ITexture,
  targetedViews: Set<EntityView<AnyEntity>>
) => EntityView<E>;
