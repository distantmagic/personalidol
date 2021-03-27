import { AmbientLightView } from "./AmbientLightView";
import { HemisphereLightView } from "./HemisphereLightView";
import { InstancedGLTFModelView } from "./InstancedGLTFModelView";
import { MD2ModelView } from "./MD2ModelView";
import { PlayerView } from "./PlayerView";
import { PointLightView } from "./PointLightView";
import { SpotlightLightView } from "./SpotlightLightView";
import { TargetView } from "./TargetView";
import { WorldspawnGeometryView } from "./WorldspawnGeometryView";

import type { Logger } from "loglevel";
import type { Scene } from "three/src/scenes/Scene";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityFuncGroup } from "./EntityFuncGroup.type";
import type { EntityGLTFModel } from "./EntityGLTFModel.type";
import type { EntityLightAmbient } from "./EntityLightAmbient.type";
import type { EntityLightHemisphere } from "./EntityLightHemisphere.type";
import type { EntityLightPoint } from "./EntityLightPoint.type";
import type { EntityLightSpotlight } from "./EntityLightSpotlight.type";
import type { EntityLookup } from "./EntityLookup.type";
import type { EntityLookupCallback } from "./EntityLookupCallback.type";
import type { EntityLookupTable } from "./EntityLookupTable.type";
import type { EntityMD2Model } from "./EntityMD2Model.type";
import type { EntityPlayer } from "./EntityPlayer.type";
import type { EntitySounds } from "./EntitySounds.type";
import type { EntitySparkParticles } from "./EntitySparkParticles.type";
import type { EntityTarget } from "./EntityTarget.type";
import type { EntityView } from "./EntityView.interface";
import type { EntityViewFactory as IEntityViewFactory } from "./EntityViewFactory.interface";
import type { EntityWorldspawn } from "./EntityWorldspawn.type";
import type { InstancedGLTFModelViewManager } from "./InstancedGLTFModelViewManager.interface";
import type { UserSettings } from "./UserSettings.type";

export function EntityViewFactory(
  logger: Logger,
  userSettings: UserSettings,
  instancedGLTFModelViewManager: InstancedGLTFModelViewManager,
  rpcLookupTable: RPCLookupTable,
  scene: Scene,
  domMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  texturesMessagePort: MessagePort
): IEntityViewFactory {
  const entityLookupTable: EntityLookupTable = {
    func_group(entity: EntityFuncGroup): EntityView<EntityFuncGroup> {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    light_ambient(entity: EntityLightAmbient): EntityView<EntityLightAmbient> {
      return AmbientLightView(logger, userSettings, scene, entity);
    },

    light_hemisphere(entity: EntityLightHemisphere): EntityView<EntityLightHemisphere> {
      return HemisphereLightView(logger, userSettings, scene, entity);
    },

    light_point(entity: EntityLightPoint): EntityView<EntityLightPoint> {
      return PointLightView(logger, userSettings, scene, entity);
    },

    light_spotlight(entity: EntityLightSpotlight, worldspawnTexture: ITexture, targetedViews: Set<EntityView<AnyEntity>>): EntityView<EntityLightSpotlight> {
      return SpotlightLightView(logger, userSettings, scene, entity, targetedViews);
    },

    model_gltf(entity: EntityGLTFModel): EntityView<EntityGLTFModel> {
      instancedGLTFModelViewManager.expectEntity(entity);

      return InstancedGLTFModelView(logger, userSettings, scene, entity, instancedGLTFModelViewManager);
    },

    model_md2(entity: EntityMD2Model): EntityView<EntityMD2Model> {
      return MD2ModelView(logger, userSettings, scene, entity, domMessagePort, md2MessagePort, texturesMessagePort, rpcLookupTable);
    },

    player(entity: EntityPlayer): EntityView<EntityPlayer> {
      return PlayerView(logger, userSettings, scene, entity, domMessagePort, md2MessagePort, texturesMessagePort, rpcLookupTable);
    },

    sounds(entity: EntitySounds): EntityView<EntitySounds> {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    spark_particles(entity: EntitySparkParticles): EntityView<EntitySparkParticles> {
      throw new Error(`Not yet implemented: "${entity.classname}"`);
    },

    target(entity: EntityTarget): EntityView<EntityTarget> {
      return TargetView(scene, entity);
    },

    worldspawn(entity: EntityWorldspawn, worldspawnTexture: ITexture): EntityView<EntityWorldspawn> {
      return WorldspawnGeometryView(logger, userSettings, scene, entity, worldspawnTexture);
    },
  };

  function _getEntityLookupCallback<K extends keyof EntityLookupTable>(classname: K): EntityLookupCallback<K, EntityLookup[K]> {
    if (!_isClassname<K>(classname)) {
      throw new Error(`Unknown entity class: ${classname}`);
    }

    return (entityLookupTable[classname] as unknown) as EntityLookupCallback<K, EntityLookup[K]>;
  }

  function _isClassname<K extends keyof EntityLookupTable>(classname: string): classname is K {
    return entityLookupTable.hasOwnProperty(classname);
  }

  function create<K extends keyof EntityLookup>(entity: EntityLookup[K], targetedViews: Set<EntityView<AnyEntity>>, worldspawnTexture: ITexture): EntityView<EntityLookup[K]> {
    return _getEntityLookupCallback<K>(entity.classname as K)(entity, worldspawnTexture, targetedViews);
  }

  return Object.freeze({
    isEntityViewFactory: true,

    create: create,
  });
}
