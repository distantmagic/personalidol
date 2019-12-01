// @flow

import * as React from "react";
import { NavLink, Route, Switch } from "react-router-dom";

import ModalToolbar from "./ModalToolbar";

export default function ModalSettings() {
  return (
    <div className="dd__modal__settings">
      <ModalToolbar title="Ustawienia" />
      <nav className="dd__modal__settings__navigation">
        <NavLink to="/settings">Ogólne</NavLink>
        <NavLink to="/settings/gfx">Grafika</NavLink>
        <NavLink to="/settings/sound">Dźwięk</NavLink>
      </nav>
      <div className="dd__modal__settings__body">
        <Switch>
          <Route exact path="/settings">
            :D
          </Route>
          <Route exact path="/settings/gfx">
            GFX
          </Route>
          <Route exact path="/settings/sound">
            Sound
          </Route>
        </Switch>
      </div>
    </div>
  );
}
