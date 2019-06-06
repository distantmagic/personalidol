// @flow

import type { GameState as GameStateInterface } from "../interfaces/GameState";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default class GameState implements GameStateInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }
}
