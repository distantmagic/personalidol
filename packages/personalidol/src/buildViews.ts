import jexl from "jexl";

import { name } from "@personalidol/framework/src/name";

import { isTargeting } from "./isTargeting";

import { createViewBuildingPlan } from "./createViewBuildingPlan";

import type { Logger } from "loglevel";
import type { Texture as ITexture } from "three/src/textures/Texture";

import type { AnyEntity } from "./AnyEntity.type";
import type { EntityView } from "./EntityView.interface";
import type { EntityViewFactory } from "./EntityViewFactory.interface";
import type { GameState } from "./GameState.type";
import type { UIState } from "./UIState.type";
import type { ViewBuildingStep } from "./ViewBuildingStep.type";

async function* _filterEntities(gameState: GameState, uiState: UIState, entities: ReadonlyArray<AnyEntity>): AsyncGenerator<AnyEntity> {
  const expressionContext = Object.freeze({
    gameState: Object.freeze(Object.assign({}, gameState)),
    uiState: Object.freeze(Object.assign({}, uiState)),
  });

  for (let entity of entities) {
    const expression: undefined | string = entity.properties.if;

    if ("string" !== typeof entity.properties.if) {
      yield entity;
      continue;
    }

    const result = await jexl.eval(expression, expressionContext);

    if ("boolean" !== typeof result) {
      throw new Error(`Entity expression evaluated to ${typeof result} instead of boolean: "${expression}"`);
    }

    if (result) {
      yield entity;
    }
  }
}

function _findTargetedViews(entityViews: WeakMap<AnyEntity, EntityView<AnyEntity>>, step: ViewBuildingStep): Set<EntityView<AnyEntity>> {
  const entity: AnyEntity = step.entity;
  const targetedViews: Set<EntityView<AnyEntity>> = new Set();

  if (!isTargeting(entity)) {
    return targetedViews;
  }

  for (let targetedEntity of step.targetedEntities) {
    const targetedView: undefined | EntityView<AnyEntity> = entityViews.get(targetedEntity);

    if (!targetedView) {
      throw new Error(`Targeted entity view was expected to be ready before constructing "${entity.classname}": "${targetedEntity.classname}"`);
    }

    targetedViews.add(targetedView);
  }

  return targetedViews;
}

export async function* buildViews(
  logger: Logger,
  gameState: GameState,
  uiState: UIState,
  entityViewFactory: EntityViewFactory,
  worldspawnTexture: ITexture,
  entities: ReadonlyArray<AnyEntity>
): AsyncGenerator<EntityView<AnyEntity>> {
  const entityViews: WeakMap<AnyEntity, EntityView<AnyEntity>> = new WeakMap();
  const filteredEntities: Array<AnyEntity> = [];

  for await (let entity of _filterEntities(gameState, uiState, entities)) {
    filteredEntities.push(entity);
  }

  for await (let step of createViewBuildingPlan(uiState, filteredEntities)) {
    const targetedViews = _findTargetedViews(entityViews, step);
    const entityView = entityViewFactory.create(step.entity, targetedViews, worldspawnTexture);

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
