import { name } from "@personalidol/framework/src/name";

import { isTargeting } from "./isTargeting";

import { createViewBuildingPlan } from "./createViewBuildingPlan";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityLookup } from "./EntityLookup.type";
import type { EntityLookupCallback } from "./EntityLookupCallback.type";
import type { EntityLookupTable } from "./EntityLookupTable.type";
import type { EntityView } from "./EntityView.interface";
import type { ViewBuildingStep } from "./ViewBuildingStep.type";

function _createEntityView<K extends keyof EntityLookup>(
  logger: Logger,
  entityLookupTable: EntityLookupTable,
  worldspawnTexture: ITexture,
  entity: EntityLookup[K],
  targetedViews: Set<EntityView>
): EntityView {
  if (!entityLookupTable.hasOwnProperty(entity.classname)) {
    throw new Error(`Unknown entity class: ${entity.classname}`);
  }

  return (entityLookupTable[entity.classname] as EntityLookupCallback<K>)(entity, worldspawnTexture, targetedViews);
}

function _findTargetedViews(entityViews: WeakMap<AnyEntity, EntityView>, step: ViewBuildingStep): Set<EntityView> {
  const entity: AnyEntity = step.entity;
  const targetedViews: Set<EntityView> = new Set();

  if (!isTargeting(entity)) {
    return targetedViews;
  }

  for (let targetedEntity of step.targetedEntities) {
    const targetedView: undefined | EntityView = entityViews.get(targetedEntity);

    if (!targetedView) {
      throw new Error(`Targeted entity view was expected to be ready before constructing "${entity.classname}": "${targetedEntity.classname}"`);
    }

    targetedViews.add(targetedView);
  }

  return targetedViews;
}

export function* buildViews(logger: Logger, entityLookupTable: EntityLookupTable, worldspawnTexture: ITexture, entities: ReadonlyArray<AnyEntity>): Generator<EntityView> {
  const entityViews: WeakMap<AnyEntity, EntityView> = new WeakMap();

  for (let step of createViewBuildingPlan(entities)) {
    const targetedViews = _findTargetedViews(entityViews, step);
    const entityView = _createEntityView(logger, entityLookupTable, worldspawnTexture, step.entity, targetedViews);

    // Some sanity checks for entity views.
    if (entityView.isExpectingTargets && targetedViews.size < 1) {
      throw new Error(`Entity view is expecting targets: "${name(entityView)}"`);
    }

    if (!entityView.isExpectingTargets && targetedViews.size > 0) {
      throw new Error(`Entity view is not expecting targets: "${name(entityView)}"`);
    }

    entityViews.set(step.entity, entityView);

    yield entityView;
  }
}
