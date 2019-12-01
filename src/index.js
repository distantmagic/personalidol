// @flow

import raf from "raf";
import React from "react";
import ReactDOM from "react-dom";
import yn from "yn";
import { HashRouter } from "react-router-dom";

// import * as serviceWorker from './serviceWorker';
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
import { default as UnexpectedExceptionHandlerFilter } from "./framework/classes/ExceptionHandlerFilter/Unexpected";
import { default as ConsoleLogger } from "./framework/classes/Logger/Console";

// import type { PrimaryWorker as PrimaryWorkerInterface } from "./framework/interfaces/PrimaryWorker";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
//
/* eslint-disable import/no-webpack-loader-syntax */
// $FlowFixMe
// import PrimaryWorker from "workerize-loader!./worker";
/* eslint-enable import/no-webpack-loader-syntax */

import "./scss/index.scss";

async function init(rootElement: HTMLElement): Promise<void> {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const logger = new ConsoleLogger();
  const debug = new Debugger();
  const exceptionHandlerFilter = new UnexpectedExceptionHandlerFilter();
  const exceptionHandler = new ExceptionHandler(logger, exceptionHandlerFilter);
  const expressionBus = new ExpressionBus();
  const expressionContext = new ExpressionContext(loggerBreadcrumbs.add("ExpressionContext"));
  const loadingManager = new LoadingManager(loggerBreadcrumbs.add("LoadingManager"), exceptionHandler);
  const queryBus = new QueryBus(loggerBreadcrumbs.add("QueryBus"));
  const clockReactiveController = new ClockReactiveController(new BusClock(), queryBus);
  // const worker: PrimaryWorkerInterface = new PrimaryWorker();

  // console.log(await worker.hello());

  // serviceWorker.register();
  debug.setIsEnabled(
    yn(process.env.REACT_APP_DEBUG && false, {
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

async function checkInit(): Promise<void> {
  const rootElement = document.getElementById("dd-root");

  if (rootElement) {
    if (rootElement.classList.contains("js-dd-capable")) {
      rootElement.classList.add("dd__capable");

      return init(rootElement);
    } else if (rootElement.classList.contains("js-dd-incapable")) {
      return;
    }
  }

  raf(checkInit);
}

raf(checkInit);
