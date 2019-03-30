// @flow

import * as React from "react";
import upperFirst from "lodash/upperFirst";
import { Route, Switch } from "react-router-dom";

import Character from "../framework/classes/Entity/Person/Character";
import HudModalCharacterInventory from "./HudModalCharacterInventory";
import HudModalCharacterStats from "./HudModalCharacterStats";
import HudModalLoader from "./HudModalLoader";

type Props = {|
  character: Character
|};

export default function HudModalCharacter(props: Props) {
  const [state, setState] = React.useState({
    id: null,
    isLoading: true,
    name: null
  });

  React.useEffect(
    function() {
      props.character.name().then(name => {
        setState({
          id: name,
          isLoading: false,
          name: upperFirst(name)
        });
      });
    },
    [props.character]
  );

  if (state.isLoading) {
    return <HudModalLoader label="Loading character stats" />;
  }

  return (
    <div className="dd__frame dd__modal__character">
      <div className="dd__modal__character__avatar">
        <img
          alt="portrait"
          className="dd__modal__character__avatar__image"
          src={`/assets/portrait-${state.id}.jpg`}
        />
      </div>
      <div className="dd__modal__character__content">
        <Switch>
          <Route
            exact
            path="/character/:characterId/inventory"
            component={() => (
              <HudModalCharacterInventory character={props.character} />
            )}
          />
          <Route
            component={() => (
              <HudModalCharacterStats character={props.character} />
            )}
          />
        </Switch>
      </div>
      <div className="dd__modal__character__name">{state.name}</div>
      <div className="dd__modal__character__tabs">tabs tabs</div>
    </div>
  );
}
