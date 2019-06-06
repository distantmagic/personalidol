// @flow

import Debugger from "./Debugger";
import ExceptionHandler from "./ExceptionHandler";
import Game from "./Game";
import Logger from "./Logger";
import LoggerBreadcrumbs from "./LoggerBreadcrumbs";

it("holds game state", function() {
  const debug = new Debugger();
  const logger = new Logger();
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const exceptionHandler = new ExceptionHandler(logger);
  const game = new Game(loggerBreadcrumbs, debug, exceptionHandler);
});
