// @flow

import * as React from "react";
import { Route, Switch } from "react-router-dom";

import HudModalCharacter from "./HudModalCharacter";
import HudModalOverlay from "./HudModalOverlay";
import HudModalRouterNotFound from "./HudModalRouterNotFound";

type Props = {||};

export default function HudModalRouterDefaultRoute(props: Props) {
  return (
    <HudModalOverlay>
      <Switch>
        <Route
          exact
          path="/character/:characterId"
          component={HudModalCharacter}
        />
        <Route component={HudModalRouterNotFound} />
      </Switch>
    </HudModalOverlay>
  );
}
