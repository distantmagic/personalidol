// @flow

import "core-js/es6/map";
import "core-js/es6/set";
import "core-js/es6/promise";
import "core-js/es6/object";

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
