// @flow

import "core-js/features/map";
import "core-js/features/set";
import "core-js/features/promise";
import "core-js/features/object";

// import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";

import Debugger from "./framework/classes/Debugger";
import ExceptionHandler from "./framework/classes/ExceptionHandler";
import ExpressionBus from "./framework/classes/ExpressionBus";
import ExpressionContext from "./framework/classes/ExpressionContext";
import Logger from "./framework/classes/Logger";
import LoggerBreadcrumbs from "./framework/classes/LoggerBreadcrumbs";
import Main from "./components/Main";
import QueryBus from "./framework/classes/QueryBus";

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   environment: process.env.REACT_APP_ENVIRONMENT,
//   release: process.env.REACT_APP_RELEASE
// });

function init(rootElement: HTMLElement) {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const logger = new Logger();
  const debug = new Debugger();
  const exceptionHandler = new ExceptionHandler(logger);
  const expressionBus = new ExpressionBus();
  const expressionContext = new ExpressionContext(loggerBreadcrumbs.add("ExpressionContext"))
  const queryBus = new QueryBus(loggerBreadcrumbs.add("QueryBus"));

  ReactDOM.render(
    <Main
      debug={debug}
      exceptionHandler={exceptionHandler}
      expressionBus={expressionBus}
      expressionContext={expressionContext}
      logger={logger}
      loggerBreadcrumbs={loggerBreadcrumbs}
      queryBus={queryBus}
    />,
    rootElement
  );
}

const rootElement = document.getElementById("root");

if (rootElement) {
  init(rootElement);
}
