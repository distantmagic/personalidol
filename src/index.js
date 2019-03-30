// @flow

import "core-js/es6/map";
import "core-js/es6/set";
import "core-js/es6/promise";
import "core-js/es6/object";

// import * as Sentry from "@sentry/browser";
import React from "react";
import ReactDOM from "react-dom";

import Logger from "./framework/classes/Logger";
import Main from "./components/Main";

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   environment: process.env.REACT_APP_ENVIRONMENT,
//   release: process.env.REACT_APP_RELEASE
// });

function init(rootElement: HTMLElement) {
  document.addEventListener("readystatechange", function() {
    if ("complete" === document.readyState) {
      ReactDOM.render(<Main logger={new Logger()} />, rootElement);
    }
  });
}

const rootElement = document.getElementById("root");

if (rootElement) {
  init(rootElement);
}
