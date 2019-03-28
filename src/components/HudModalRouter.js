// @flow

import * as React from "react";
import { HashRouter, Route } from "react-router-dom";

import HudModalRouterDefaultRoute from "./HudModalRouterDefaultRoute";

type Props = {||};

export default function HudModalRouter(props: Props) {
  return (
    <HashRouter>
      <Route path="/:any" component={HudModalRouterDefaultRoute} />
    </HashRouter>
  );
}
