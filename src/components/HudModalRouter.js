// @flow

import * as React from "react";
import { HashRouter, Route } from "react-router-dom";

import HudModalRouterDefaultRoute from "./HudModalRouterDefaultRoute";

import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger,
  queryBus: QueryBus
|};

export default function HudModalRouter(props: Props) {
  return (
    <HashRouter>
      <Route
        path="/:any"
        component={() => (
          <HudModalRouterDefaultRoute
            logger={props.logger}
            queryBus={props.queryBus}
          />
        )}
      />
    </HashRouter>
  );
}
