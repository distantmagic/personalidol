// @flow

import "core-js/es6/map";
import "core-js/es6/set";
import "core-js/es6/promise";
import "core-js/es6/object";

// import * as Sentry from "@sentry/browser";
// import Keycloak from "keycloak-js";
import React from "react";
import ReactDOM from "react-dom";

import Logger from "./framework/classes/Logger";
import Main from "./components/Main";

// Sentry.init({
//   dsn: process.env.REACT_APP_SENTRY_DSN,
//   environment: process.env.REACT_APP_ENVIRONMENT,
//   release: process.env.REACT_APP_RELEASE
// });

// const keycloak = Keycloak({
//   url: "https://keycloak.newride.construction/auth",
//   realm: "distant-divinity",
//   clientId: "webapp"
// });

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.render(<Main logger={new Logger()} />, rootElement);
}
