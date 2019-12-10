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

import "./scss/index.scss";

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
    await serviceWorker.register(loggerBreadcrumbs.add("serviceWorker").add("register"), logger);
  } catch (exception) {
    await exceptionHandler.captureException(loggerBreadcrumbs, exception);
  }

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
          loggerBreadcrumbs={loggerBreadcrumbs}
          queryBus={queryBus}
        />
      </HashRouter>
    </React.StrictMode>,
    rootElement
  );
}

document.addEventListener(
  "dd-capable",
  function(evt: Event) {
    const loggerBreadcrumbs = new LoggerBreadcrumbs();
    const logger = new ConsoleLogger();
    const target = evt.target;

    if (target instanceof HTMLElement) {
      init(logger, loggerBreadcrumbs, target);
    } else {
      const message = "Game loader target has to be a valid HTML element.";

      // $FlowFixMe
      evt.detail.setInternalError("Internal setup error", message);

      logger.error(loggerBreadcrumbs, message);
    }
  },
  {
    once: true,
  }
);
