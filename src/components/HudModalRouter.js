// @flow

import * as React from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import HudModalCharacter from "./HudModalCharacter";
import HudModalOverlay from "./HudModalOverlay";

import type { ContextRouter } from "react-router";

type Props = {||};

export default function HudModalRouter(props: Props) {
  function renderNotFoundRoute() {
    return <Redirect to="/" />;
  }

  function renderModalOverlay(router: ContextRouter) {
    // console.log(router);
    return (
      <HudModalOverlay>
        <Switch>
          <Route
            exact
            path="/character/:characterId"
            component={HudModalCharacter}
          />
          <Route component={renderNotFoundRoute} />
        </Switch>
      </HudModalOverlay>
    );
  }

  return (
    <HashRouter>
      <Route path="/:any" component={renderModalOverlay} />
    </HashRouter>
  );
}
