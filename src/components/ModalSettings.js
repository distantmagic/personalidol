// @flow

import * as React from "react";
import { NavLink, Route, Switch } from "react-router-dom";

import ModalSettingsGraphics from "./ModalSettingsGraphics";
import ModalToolbar from "./ModalToolbar";

export default function ModalSettings() {
  return (
    <div className="dd__modal__window dd__frame">
      <ModalToolbar label="Ustawienia" />
      <div className="dd__modal__body dd__modal__settings">
        <nav className="dd__frame dd__modal__navigation">
          <NavLink activeClassName="dd__button--active dd__button--pressed" className="dd__button dd__button--text" exact to="/settings">
            Ogólne
          </NavLink>
          <NavLink activeClassName="dd__button--active dd__button--pressed" className="dd__button dd__button--text" to="/settings/gfx">
            Grafika
          </NavLink>
          <NavLink activeClassName="dd__button--active dd__button--pressed" className="dd__button dd__button--text" to="/settings/sound">
            Dźwięk
          </NavLink>
        </nav>
        <div className="dd__frame dd__modal__settings__body">
          <Switch>
            <Route exact path="/settings"></Route>
            <Route exact path="/settings/gfx">
              <ModalSettingsGraphics />
            </Route>
            <Route exact path="/settings/sound"></Route>
          </Switch>
        </div>
      </div>
    </div>
  );
}
