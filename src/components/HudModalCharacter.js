// @flow

import * as React from "react";
import { Route, Switch } from "react-router-dom";

import HudModalCharacterInventory from "./HudModalCharacterInventory";
import HudModalCharacterStats from "./HudModalCharacterStats";
import HudModalLoader from "./HudModalLoader";

import type { Match } from "react-router";

type Props = {|
  match: Match
|};

export default function HudModalRouter(props: Props) {
  const [state, setState] = React.useState({
    character: null,
    isLoading: true
  });

  React.useEffect(
    function() {
      setState({
        charater: null,
        isLoading: false
      });
    },
    [props.match.params.characterId]
  );

  if (state.isLoading) {
    return <HudModalLoader />;
  }

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
