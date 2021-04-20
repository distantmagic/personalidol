import { isEntityViewOfClass } from "./isEntityViewOfClass";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";
import type { EntityView } from "./EntityView.interface";
import type { NPCEntity } from "./NPCEntity.type";

export function isNPCEntityView(view: EntityView<AnyEntity>): view is EntityView<NPCEntity> {
  return isEntityViewOfClass<EntityPlayer>(view, "player") || isEntityViewOfClass<EntityGLTFModel>(view, "model_gltf") || isEntityViewOfClass<EntityMD2Model>(view, "model_md2");
}
