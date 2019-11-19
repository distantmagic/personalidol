// @flow

import * as React from "react";
import Image from "react-image";
import upperFirst from "lodash/upperFirst";
import { NavLink, Route, Switch } from "react-router-dom";

import Character from "../framework/classes/Entity/Person/Character";
import HudModalCharacterBiography from "./HudModalCharacterBiography";
import HudModalCharacterBody from "./HudModalCharacterBody";
import HudModalCharacterInventory from "./HudModalCharacterInventory";
import HudModalCharacterSoul from "./HudModalCharacterSoul";
import HudModalLoader from "./HudModalLoader";

import imagePortraitArlance from "../assets/portrait-arlance.jpg";
import imagePortraitMoore from "../assets/portrait-moore.jpg";
import imagePortraitCircassia from "../assets/portrait-circassia.jpg";

type Props = {|
  character: Character,
|};

function getPortraitSrc(id: string): string {
  switch (id) {
    case "arlance":
      return imagePortraitArlance;
    case "circassia":
      return imagePortraitCircassia;
    case "moore":
      return imagePortraitMoore;
    default:
      return imagePortraitArlance;
  }
}

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
        <Image alt="portrait" className="dd__modal__character__avatar__image" src={getPortraitSrc(state.id)} />
      </div>
      <h1 className="dd__modal__character__name">{state.name}</h1>
      <nav className="dd__modal__character__tabs">
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
          exact
          to={`/character/${state.id}`}
        >
          Ciało
        </NavLink>
        <NavLink
          activeClassName="dd__modal__character__tab--active dd__frame--active"
          className="dd__frame dd__frame--tab dd__modal__character__tab"
          exact
          to={`/character/${state.id}/soul`}
        >
          Dusza
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
          <Route exact path="/character/:characterId/inventory" component={() => <HudModalCharacterInventory character={props.character} />} />
          <Route exact path="/character/:characterId/biography" component={() => <HudModalCharacterBiography character={props.character} />} />
          <Route exact path="/character/:characterId" component={() => <HudModalCharacterBody character={props.character} />} />
          <Route exact path="/character/:characterId/soul" component={() => <HudModalCharacterSoul character={props.character} />} />
        </Switch>
      </div>
    </section>
  );
}
