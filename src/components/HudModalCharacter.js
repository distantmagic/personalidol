// @flow

import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Character from "../framework/classes/Entity/Person/Character";
import HudModalCharacterInventory from "./HudModalCharacterInventory";
import HudModalCharacterStats from "./HudModalCharacterStats";

type Props = {|
  character: Character
|};

export default function HudModalCharacter(props: Props) {
  return (
    <Switch>
      <Route
        exact
        path="/character/:characterId/inventory"
        component={HudModalCharacterInventory}
      />
      <Route
        component={() => <HudModalCharacterStats character={props.character} />}
      />
    </Switch>
  );
}
