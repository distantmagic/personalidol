import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";

// prettier-ignore
export type NPCEntity =
  | EntityGLTFModel
  | EntityMD2Model
  | EntityPlayer
;
