import { isTargeting } from "@personalidol/personalidol-mapentities/src/isTargeting";
import { name } from "@personalidol/framework/src/name";

import { createViewBuildingPlan } from "./createViewBuildingPlan";
import { isEntityView } from "./isEntityView";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { EntityAny } from "@personalidol/personalidol-mapentities/src/EntityAny.type";
import type { EntityLookup } from "@personalidol/personalidol-mapentities/src/EntityLookup.type";
// import type { TargetedEntity } from "@personalidol/personalidol-mapentities/src/TargetedEntity.type";
// import type { TargetingEntity } from "@personalidol/personalidol-mapentities/src/TargetingEntity.type";
import type { View } from "@personalidol/framework/src/View.interface";

import type { EntityLookupCallback } from "./EntityLookupCallback.type";
import type { EntityLookupTable } from "./EntityLookupTable.type";
import type { ViewBuildingStep } from "./ViewBuildingStep.type";

function _createEntityView<K extends keyof EntityLookup>(
  logger: Logger,
  entityLookupTable: EntityLookupTable,
  worldspawnTexture: ITexture,
  entity: EntityLookup[K],
  targetedViews: Set<View>
): View {
  if (!entityLookupTable.hasOwnProperty(entity.classname)) {
    throw new Error(`Unknown entity class: ${entity.classname}`);
  }

  logger.trace("CREATE MAP ENTITY VIEW", entity.classname);

  return (entityLookupTable[entity.classname] as EntityLookupCallback<K>)(entity, worldspawnTexture, targetedViews);
}

function _findTargetedViews(entityViews: WeakMap<EntityAny, View>, step: ViewBuildingStep): Set<View> {
  const entity: EntityAny = step.entity;
  const targetedViews: Set<View> = new Set();

  if (!isTargeting(entity)) {
    return targetedViews;
  }

  for (let targetedEntity of step.targetedEntities) {
    const targetedView: undefined | View = entityViews.get(targetedEntity);

    if (!targetedView) {
      throw new Error(`Targeted entity view was expected to be ready before constructing "${entity.classname}": "${targetedEntity.classname}"`);
    }

    targetedViews.add(targetedView);
  }

  return targetedViews;
}

export function* buildViews(logger: Logger, entityLookupTable: EntityLookupTable, worldspawnTexture: ITexture, entities: ReadonlyArray<EntityAny>): Generator<View> {
  const entityViews: WeakMap<EntityAny, View> = new WeakMap();

  for (let step of createViewBuildingPlan(entities)) {
    const targetedViews = _findTargetedViews(entityViews, step);
    const entityView = _createEntityView(logger, entityLookupTable, worldspawnTexture, step.entity, targetedViews);

    if (isEntityView(entityView)) {
      // Some sanity checks for entity views.
      if (entityView.isExpectingTargets && targetedViews.size < 1) {
        throw new Error(`Entity view is expecting targets: "${name(entityView)}"`);
      }

      if (!entityView.isExpectingTargets && targetedViews.size > 0) {
        throw new Error(`Entity view is not expecting targets: "${name(entityView)}"`);
      }
    }

    entityViews.set(step.entity, entityView);

    yield entityView;
  }
}
