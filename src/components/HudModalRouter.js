// @flow

import * as React from "react";
import { HashRouter, Route } from "react-router-dom";

import HudModalRouterDefaultRoute from "./HudModalRouterDefaultRoute";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
|};

export default function HudModalRouter(props: Props) {
  return (
    <HashRouter>
      <Route
        path="/:any"
        component={() => (
          <HudModalRouterDefaultRoute
            exceptionHandler={props.exceptionHandler}
            loggerBreadcrumbs={props.loggerBreadcrumbs.add("HudModalRouterDefaultRoute")}
            queryBus={props.queryBus}
          />
        )}
      />
    </HashRouter>
  );
}
