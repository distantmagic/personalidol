// @flow

import * as PF from "pathfinding";

import ElementPosition from "./ElementPosition";
import TiledCustomProperty from "./TiledCustomProperty";
import TiledPath from "./TiledPath";

import type { ElementPosition as ElementPositionInterface } from "../interfaces/ElementPosition";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledMap } from "../interfaces/TiledMap";
import type { TiledPath as TiledPathInterface } from "../interfaces/TiledPath";
import type { TiledPathfinder as TiledPathfinderInterface } from "../interfaces/TiledPathfinder";

export default class TiledPathfinder implements TiledPathfinderInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +tiledMap: TiledMap;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, tiledMap: TiledMap) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.tiledMap = tiledMap;
  }

  async findPath(
    start: ElementPositionInterface<"tile">,
    end: ElementPositionInterface<"tile">
  ): Promise<TiledPathInterface<"tile">> {
    const loggerBreadcrumbs = this.loggerBreadcrumbs.add("findPath");
    const walkabilityProperty = new TiledCustomProperty(loggerBreadcrumbs, "isWalkabilityMap", "bool", "true");
    const walkabilityLayer = this.tiledMap.getLayerWithProperty(walkabilityProperty);
    const coveredGrid = walkabilityLayer.getTiledMapGrid().getCoveredGrid();
    const pathfinderGrid = new PF.Grid(coveredGrid);
    const pathfinderFinder = new PF.BestFirstFinder({
      diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles,
    });

    const path = pathfinderFinder.findPath(start.getX(), start.getY(), end.getX(), end.getY(), pathfinderGrid);
    const tiledPath = new TiledPath(loggerBreadcrumbs);

    for (let step of path) {
      const elementPosition = new ElementPosition<"tile">(...step);

      tiledPath.addStep(elementPosition);
    }

    return tiledPath;
  }
}
