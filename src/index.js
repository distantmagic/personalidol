// @flow

import "core-js/features/map";
import "core-js/features/set";
import "core-js/features/promise";
import "core-js/features/object";

// import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";

import ExceptionHandler from "./framework/classes/ExceptionHandler";
import Logger from "./framework/classes/Logger";
import LoggerBreadcrumbs from "./framework/classes/LoggerBreadcrumbs";
import Main from "./components/Main";

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   environment: process.env.REACT_APP_ENVIRONMENT,
//   release: process.env.REACT_APP_RELEASE
// });

function render(rootElement: HTMLElement) {
  const logger = new Logger();

  ReactDOM.render(
    <Main
      exceptionHandler={new ExceptionHandler(logger)}
      logger={logger}
      loggerBreadcrumbs={new LoggerBreadcrumbs()}
    />,
    rootElement
  );
}

function init(rootElement: HTMLElement) {
  document.addEventListener("readystatechange", function() {
    if ("complete" !== document.readyState) {
      return;
    }

    render(rootElement);
  });
}

const rootElement = document.getElementById("root");

if (rootElement) {
  init(rootElement);
}
