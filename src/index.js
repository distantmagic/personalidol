// @flow

import React from "react";
import ReactDOM from "react-dom";
import yn from "yn";
import { HashRouter } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import BusClock from "./framework/classes/BusClock";
import ClockReactiveController from "./framework/classes/ClockReactiveController";
import Debugger from "./framework/classes/Debugger";
import ExceptionHandler from "./framework/classes/ExceptionHandler";
import ExpressionBus from "./framework/classes/ExpressionBus";
import ExpressionContext from "./framework/classes/ExpressionContext";
import LoadingManager from "./framework/classes/LoadingManager";
import LoggerBreadcrumbs from "./framework/classes/LoggerBreadcrumbs";
import Main from "./components/Main";
import QueryBus from "./framework/classes/QueryBus";
import { default as ConsoleLogger } from "./framework/classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "./framework/classes/ExceptionHandlerFilter/Unexpected";

import type { Logger } from "./framework/interfaces/Logger";
import type { LoggerBreadcrumbs as LoggerBreadcrumbsInterface } from "./framework/interfaces/LoggerBreadcrumbs";

async function init(logger: Logger, loggerBreadcrumbs: LoggerBreadcrumbsInterface, rootElement: HTMLElement): Promise<void> {
  const debug = new Debugger();
  const exceptionHandlerFilter = new UnexpectedExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
  const expressionBus = new ExpressionBus();
  const expressionContext = new ExpressionContext(loggerBreadcrumbs.add("ExpressionContext"));
  const loadingManager = new LoadingManager(loggerBreadcrumbs.add("LoadingManager"), exceptionHandler);
  const queryBus = new QueryBus(exceptionHandler, loggerBreadcrumbs.add("QueryBus"));
  const clockReactiveController = new ClockReactiveController(new BusClock(), queryBus);

  try {
    // await serviceWorker.register(loggerBreadcrumbs.add("serviceWorker").add("register"), logger);
    await serviceWorker.unregister(loggerBreadcrumbs.add("serviceWorker").add("unregister"));
  } catch (exception) {
    await exceptionHandler.captureException(loggerBreadcrumbs, exception);
  }

  function onWindowResize() {
    const root = document.documentElement;

    if (!root) {
      return;
    }

    root.style.setProperty("--dd-window-inner-height", `${window.innerHeight}px`);
    root.style.setProperty("--dd-window-inner-width", `${window.innerWidth}px`);
  }

  window.addEventListener("resize", onWindowResize);
  onWindowResize();

  debug.setIsEnabled(
    yn(process.env.REACT_APP_FEATURE_DEBUGGER, {
      default: false,
    })
  );

  ReactDOM.render(
    <React.StrictMode>
      <HashRouter>
        <Main
          clockReactiveController={clockReactiveController}
          debug={debug}
          exceptionHandler={exceptionHandler}
          expressionBus={expressionBus}
          expressionContext={expressionContext}
          loadingManager={loadingManager}
          logger={logger}
          loggerBreadcrumbs={loggerBreadcrumbs}
          queryBus={queryBus}
        />
      </HashRouter>
    </React.StrictMode>,
    rootElement
  );
}

function onCapable() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const logger = new ConsoleLogger();
  const target = window.dd.rootElement;

  if (target instanceof HTMLElement) {
    init(logger, loggerBreadcrumbs, target);
  } else {
    const message = "Game loader target has to be a valid HTML element.";

    // $FlowFixMe
    window.dd.setup.setInternalError("Internal setup error", message);
    logger.error(loggerBreadcrumbs, message);
  }
}

function checkCapable() {
  if (window.dd?.isCapable) {
    onCapable();
  } else {
    requestAnimationFrame(checkCapable);
  }
}

requestAnimationFrame(checkCapable);
