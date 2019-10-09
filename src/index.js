// @flow

import "core-js/features/map";
import "core-js/features/set";
import "core-js/features/promise";
import "core-js/features/object";

// import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";

import CancelToken from "./framework/classes/CancelToken";
import Debugger from "./framework/classes/Debugger";
import ExceptionHandler from "./framework/classes/ExceptionHandler";
import Game from "./framework/classes/Game";
import Logger from "./framework/classes/Logger";
import LoggerBreadcrumbs from "./framework/classes/LoggerBreadcrumbs";
import Main from "./components/Main";
import MainLoop from "./framework/classes/MainLoop";
import Scheduler from "./framework/classes/Scheduler";

import type { Debugger as DebuggerInterface } from "./framework/interfaces/Debugger";
import type { ExceptionHandler as ExceptionHandlerInterface } from "./framework/interfaces/ExceptionHandler";
import type { Game as GameInterface } from "./framework/interfaces/Game";
import type { Logger as LoggerInterface } from "./framework/interfaces/Logger";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "./framework/interfaces/LoggerBreadcrumbs";
import type { Scheduler as SchedulerInterface } from "./framework/interfaces/Scheduler";

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   environment: process.env.REACT_APP_ENVIRONMENT,
//   release: process.env.REACT_APP_RELEASE
// });

function render(
  debug: DebuggerInterface,
  exceptionHandler: ExceptionHandlerInterface,
  game: GameInterface,
  logger: LoggerInterface,
  loggerBreadcrumbs: LoggerBreadcrumbsInterface,
  rootElement: HTMLElement
) {
  ReactDOM.render(
    <Main
      debug={debug}
      exceptionHandler={exceptionHandler}
      game={game}
      logger={logger}
      loggerBreadcrumbs={loggerBreadcrumbs}
    />,
    rootElement
  );
}

function init(rootElement: HTMLElement) {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const logger = new Logger();
  const cancelToken = new CancelToken(loggerBreadcrumbs);
  const debug = new Debugger();
  const exceptionHandler = new ExceptionHandler(logger);
  const game = new Game(loggerBreadcrumbs.add("Game"), debug, exceptionHandler);

  game.setExpectedFPS(70);

  function onDocumentReadyStateChange() {
    if ("complete" !== document.readyState) {
      return;
    }

    render(debug, exceptionHandler, game, logger, loggerBreadcrumbs, rootElement);
  }

  function onDocumentVisibilityChange() {
    const mainLoop = MainLoop.getInstance();

    if (document.hidden) {
      mainLoop.stop();
    } else {
      mainLoop.start();
    }
  }

  document.addEventListener("visibilitychange", onDocumentVisibilityChange);
  onDocumentVisibilityChange();

  document.addEventListener("readystatechange", onDocumentReadyStateChange);
  onDocumentReadyStateChange();

  return game.run(cancelToken);
}

const rootElement = document.getElementById("root");

if (rootElement) {
  init(rootElement);
}
