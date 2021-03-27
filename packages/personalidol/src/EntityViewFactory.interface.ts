import type { Texture as ITexture } from "three/src/textures/Texture";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityLookup } from "./EntityLookup.type";
import type { EntityView } from "./EntityView.interface";

export interface EntityViewFactory {
  readonly isEntityViewFactory: true;

  create<K extends keyof EntityLookup>(entity: EntityLookup[K], targetedViews: Set<EntityView<AnyEntity>>, worldspawnTexture: ITexture): EntityView<EntityLookup[K]>;
}
