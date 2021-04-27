import type { EntityFuncGroup } from "./EntityFuncGroup.type";
import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityLightAmbient } from "./EntityLightAmbient.type";
import type { EntityLightHemisphere } from "./EntityLightHemisphere.type";
import type { EntityLightPoint } from "./EntityLightPoint.type";
import type { EntityLightSpotlight } from "./EntityLightSpotlight.type";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";
import type { EntityScriptedZone } from "./EntityScriptedZone.type";
import type { EntitySounds } from "./EntitySounds.type";
import type { EntitySparkParticles } from "./EntitySparkParticles.type";
import type { EntityTarget } from "./EntityTarget.type";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";

// prettier-ignore
export type AnyEntity =
  | EntityFuncGroup
  | EntityGLTFModel
  | EntityLightAmbient
  | EntityLightHemisphere
  | EntityLightPoint
  | EntityLightSpotlight
  | EntityMD2Model
  | EntityPlayer
  | EntityScriptedZone
  | EntitySounds
  | EntitySparkParticles
  | EntityTarget
  | EntityWorldspawn
;
