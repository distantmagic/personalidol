// @flow

import * as React from "react";
import autoBind from "auto-bind";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";

import HudModalCharacter from "./HudModalCharacter";
import HudModalOverlay from "./HudModalOverlay";

import type { ContextRouter } from "react-router";

type Props = {||};

type State = {||};

export default class HudModalRouter extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  renderModalOverlay(router: ContextRouter) {
    console.log(router);

    return (
      <HudModalOverlay>
        <Switch>
          <Route
            exact
            path="/character/:characterId"
            component={HudModalCharacter}
          />
          <Route component={this.renderNotFoundRoute} />
        </Switch>
      </HudModalOverlay>
    );
  }

  renderNotFoundRoute() {
    return <Redirect to="/" />;
  }

  render() {
    return (
      <HashRouter>
        <Route path="/:any" component={this.renderModalOverlay} />
      </HashRouter>
    );
  }
}
