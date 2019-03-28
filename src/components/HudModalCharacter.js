// @flow

import * as React from "react";
import { Route, Switch } from "react-router-dom";

import HudModalCharacterInventory from "./HudModalCharacterInventory";
import HudModalCharacterStats from "./HudModalCharacterStats";

import type { Match } from "react-router";

type Props = {|
  match: Match
|};

export default function HudModalRouter(props: Props) {
  return (
    <Switch>
      <Route
        exact
        path="/character/:characterId/inventory"
        component={HudModalCharacterInventory}
      />
      <Route component={HudModalCharacterStats} />
    </Switch>
  );
}
