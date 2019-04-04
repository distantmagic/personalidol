// @flow

import * as React from "react";
import { HashRouter, Route } from "react-router-dom";

import HudModalRouterDefaultRoute from "./HudModalRouterDefaultRoute";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Logger } from "../framework/interfaces/Logger";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  exceptionHandler: ExceptionHandler,
  logger: Logger,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus
|};

export default function HudModalRouter(props: Props) {
  return (
    <HashRouter>
      <Route
        path="/:any"
        component={() => (
          <HudModalRouterDefaultRoute
            exceptionHandler={props.exceptionHandler}
            logger={props.logger}
            loggerBreadcrumbs={props.loggerBreadcrumbs.add(
              "HudModalRouterDefaultRoute"
            )}
            queryBus={props.queryBus}
          />
        )}
      />
    </HashRouter>
  );
}
