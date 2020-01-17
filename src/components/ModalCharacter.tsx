import * as React from "react";
import upperFirst from "lodash/upperFirst";
import { NavLink, Route, Switch } from "react-router-dom";

import ModalCharacterBiography from "src/components/ModalCharacterBiography";
import ModalCharacterBody from "src/components/ModalCharacterBody";
import ModalCharacterSoul from "src/components/ModalCharacterSoul";
import ModalLoader from "src/components/ModalLoader";
import ModalToolbar from "src/components/ModalToolbar";

import Character from "src/framework/classes/Entity/Person/Character";

import imagePortraitArlance from "src/assets/portrait-arlance.jpg";
import imagePortraitCircassia from "src/assets/portrait-circassia.jpg";
import imagePortraitMoore from "src/assets/portrait-moore.jpg";

type Props = {
  character: Character;
};

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
  const [state, setState] = React.useState<{
    id: null | string;
    isLoading: boolean;
    name: null | string;
  }>({
    id: null,
    isLoading: true,
    name: null,
  });

  React.useEffect(
    function() {
      props.character.name().then(function(name) {
        setState({
          id: name,
          isLoading: false,
          name: upperFirst(name),
        });
      });
    },
    [props.character]
  );

  if (state.isLoading || !state.id) {
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
