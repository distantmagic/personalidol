// @flow

import * as React from "react";
import upperFirst from "lodash/upperFirst";
import { NavLink, Route, Switch } from "react-router-dom";

import Character from "../framework/classes/Entity/Person/Character";
import HudModalCharacterAttributes from "./HudModalCharacterAttributes";
import HudModalCharacterBiography from "./HudModalCharacterBiography";
import HudModalCharacterInventory from "./HudModalCharacterInventory";
import HudModalLoader from "./HudModalLoader";

type Props = {|
  character: Character,
|};

export default function HudModalCharacter(props: Props) {
  const [state, setState] = React.useState({
    id: null,
    isLoading: true,
    name: null,
  });

  React.useEffect(
    function() {
      props.character.name().then(name => {
        setState({
          id: name,
          isLoading: false,
          name: upperFirst(name),
        });
      });
    },
    [props.character]
  );

  if (state.isLoading) {
    return <HudModalLoader label="Loading character attributes" />;
  }

  return (
    <section className="dd__frame dd__modal__character">
      <div className="dd__modal__character__avatar">
        <img alt="portrait" className="dd__modal__character__avatar__image" src={`/assets/portrait-${state.id}.jpg`} />
      </div>
      <h1 className="dd__modal__character__name">{state.name}</h1>
      <nav className="dd__modal__character__tabs">
        <NavLink
          activeClassName="dd__modal__character__tab--active dd__frame--active"
          className="dd__frame dd__frame--tab dd__modal__character__tab"
          exact
          to={`/character/${state.id}`}
        >
          Atrybuty
        </NavLink>
        <NavLink
          activeClassName="dd__modal__character__tab--active dd__frame--active"
          className="dd__frame dd__frame--tab dd__modal__character__tab"
          to={`/character/${state.id}/biography`}
        >
          Biografia
        </NavLink>
        <NavLink
          activeClassName="dd__modal__character__tab--active dd__frame--active"
          className="dd__frame dd__frame--tab dd__modal__character__tab"
          to={`/character/${state.id}/inventory`}
        >
          Ekwipunek i efekty
        </NavLink>
      </nav>
      <div className="dd__modal__character__content">
        <Switch>
          <Route
            exact
            path="/character/:characterId/inventory"
            component={() => <HudModalCharacterInventory character={props.character} />}
          />
          <Route
            exact
            path="/character/:characterId/biography"
            component={() => <HudModalCharacterBiography character={props.character} />}
          />
          <Route
            exact
            path="/character/:characterId"
            component={() => <HudModalCharacterAttributes character={props.character} />}
          />
        </Switch>
      </div>
    </section>
  );
}
