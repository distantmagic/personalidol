import type { EntityFuncGroup } from "./EntityFuncGroup.type";
import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityLightAmbient } from "./EntityLightAmbient.type";
import type { EntityLightHemisphere } from "./EntityLightHemisphere.type";
import type { EntityLightPoint } from "./EntityLightPoint.type";
import type { EntityLightSpotlight } from "./EntityLightSpotlight.type";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";
import type { EntitySounds } from "./EntitySounds.type";
import type { EntitySparkParticles } from "./EntitySparkParticles.type";
import type { EntityTarget } from "./EntityTarget.type";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";

export type EntityLookup = {
  func_group: EntityFuncGroup;
  light_ambient: EntityLightAmbient;
  light_hemisphere: EntityLightHemisphere;
  light_point: EntityLightPoint;
  light_spotlight: EntityLightSpotlight;
  model_gltf: EntityGLTFModel;
  model_md2: EntityMD2Model;
  player: EntityPlayer;
  sounds: EntitySounds;
  spark_particles: EntitySparkParticles;
  target: EntityTarget;
  worldspawn: EntityWorldspawn;
};
