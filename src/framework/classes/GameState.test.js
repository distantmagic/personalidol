// @flow

import GameState from "./GameState";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("holds game state", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const gameState = new GameState(loggerBreadcrumbs);
});
