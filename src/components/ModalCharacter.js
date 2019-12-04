// @flow

import * as React from "react";
import upperFirst from "lodash/upperFirst";
import { NavLink, Route, Switch } from "react-router-dom";

import Character from "../framework/classes/Entity/Person/Character";
import ModalCharacterBiography from "./ModalCharacterBiography";
import ModalCharacterBody from "./ModalCharacterBody";
import ModalCharacterSoul from "./ModalCharacterSoul";
import ModalLoader from "./ModalLoader";
import ModalToolbar from "./ModalToolbar";

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

export default React.memo<Props>(function ModalCharacter(props: Props) {
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
    return <ModalLoader comment="Loading character attributes" />;
  }

  return (
    <div className="dd__modal__window dd__frame dd__frame--modal">
      <ModalToolbar label={state.name} />
      <section className="dd__modal__body dd__modal__character">
        <div className="dd__frame dd__modal__character__avatar">
          <img alt="portrait" className="dd__modal__character__avatar__image" src={getPortraitSrc(state.id)} />
        </div>
        <nav className="dd__frame dd__modal__navigation">
          <NavLink activeClassName="dd__button--active dd__button--pressed" className="dd__button dd__button--text" exact to={`/character/${state.id}`}>
            Biografia
          </NavLink>
          <NavLink activeClassName="dd__button--active dd__button--pressed" className="dd__button dd__button--text" to={`/character/${state.id}/body`}>
            Ciało
          </NavLink>
          <NavLink activeClassName="dd__button--active dd__button--pressed" className="dd__button dd__button--text" to={`/character/${state.id}/soul`}>
            Dusza
          </NavLink>
        </nav>
        <div className="dd__frame dd__modal__character__body">
          <Switch>
            <Route exact path="/character/:characterId/body">
              <ModalCharacterBody character={props.character} />
            </Route>
            <Route exact path="/character/:characterId">
              <ModalCharacterBiography character={props.character} />
            </Route>
            <Route exact path="/character/:characterId/soul">
              <ModalCharacterSoul character={props.character} />
            </Route>
          </Switch>
        </div>
      </section>
    </div>
  );
});
