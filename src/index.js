// @flow

import React from "react";
import ReactDOM from "react-dom";
import yn from "yn";
import { HashRouter } from "react-router-dom";

import * as serviceWorker from "./serviceWorker";
import bootstrapFramework from "./framework/helpers/bootstrapFramework";
import env from "./framework/helpers/env";
import ExpressionBus from "./framework/classes/ExpressionBus";
import ExpressionContext from "./framework/classes/ExpressionContext";
import LoadingManager from "./framework/classes/LoadingManager";
import Main from "./components/Main";

import type { ClockReactiveController } from "./framework/interfaces/ClockReactiveController";
import type { Debugger } from "./framework/interfaces/Debugger";
import type { ExceptionHandler } from "./framework/interfaces/ExceptionHandler";
import type { Logger } from "./framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "./framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "./framework/interfaces/QueryBus";

function init(rootElement: HTMLElement): void {
  return void bootstrapFramework(async function(
    clockReactiveController: ClockReactiveController,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    logger: Logger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus
  ) {
    const expressionBus = new ExpressionBus();
    const expressionContext = new ExpressionContext(loggerBreadcrumbs.add("ExpressionContext"));
    const loadingManager = new LoadingManager(loggerBreadcrumbs.add("LoadingManager"), exceptionHandler);

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
      yn(env(loggerBreadcrumbs, "REACT_APP_FEATURE_DEBUGGER", ""), {
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
  });
}

function onCapable() {
  const target = window.dd.rootElement;

  if (target instanceof HTMLElement) {
    init(target);
  } else {
    const message = "Game loader target has to be a valid HTML element.";

    // $FlowFixMe
    window.dd.setup.setInternalError("Internal setup error", message);
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
