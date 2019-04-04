// @flow

import * as React from "react";
import { Route, Switch } from "react-router-dom";

import HudModalCharacterLoader from "./HudModalCharacterLoader";
import HudModalOverlay from "./HudModalOverlay";
import HudModalRouterNotFound from "./HudModalRouterNotFound";

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

export default function HudModalRouterDefaultRoute(props: Props) {
  return (
    <HudModalOverlay>
      <Switch>
        <Route
          path="/character/:characterId"
          component={routerProps => {
            return (
              <HudModalCharacterLoader
                exceptionHandler={props.exceptionHandler}
                logger={props.logger}
                loggerBreadcrumbs={props.loggerBreadcrumbs.add(
                  "HudModalCharacterLoader"
                )}
                match={routerProps.match}
                queryBus={props.queryBus}
              />
            );
          }}
        />
        <Route component={HudModalRouterNotFound} />
      </Switch>
    </HudModalOverlay>
  );
}
