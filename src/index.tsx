import React from "react";
import ReactDOM from "react-dom";
import yn from "yn";
import { HashRouter } from "react-router-dom";

import * as serviceWorker from "src/serviceWorker";
import bootstrapFramework from "src/framework/helpers/bootstrapFramework";
import env from "src/framework/helpers/env";
import LoadingManager from "src/framework/classes/LoadingManager";
import Main from "src/components/Main";

import { ClockReactiveController } from "src/framework/interfaces/ClockReactiveController";
import { Debugger } from "src/framework/interfaces/Debugger";
import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { Logger } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "src/framework/interfaces/QueryBus";

declare global {
  interface Window {
    dd: {
      isCapable: boolean;
      rootElement: HTMLElement;
      setup: {
        setInternalError(label: string, message: string): void;
      };
    };
  }
}

function init(rootElement: HTMLElement): void {
  return void bootstrapFramework(async function(
    clockReactiveController: ClockReactiveController,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    logger: Logger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus
  ) {
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

    window.dd.setup.setInternalError("Internal setup error", message);
  }
}

function checkCapable() {
  if (window.dd && window.dd.isCapable) {
    onCapable();
  } else {
    requestAnimationFrame(checkCapable);
  }
}

requestAnimationFrame(checkCapable);
