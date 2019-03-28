// @flow

import * as React from "react";
import { Route, Switch } from "react-router-dom";

import HudModalCharacterLoader from "./HudModalCharacterLoader";
import HudModalOverlay from "./HudModalOverlay";
import HudModalRouterNotFound from "./HudModalRouterNotFound";

import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger,
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
                logger={props.logger}
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
