// @flow

import * as React from "react";

import HudToolbarScrollbar from "./HudToolbarScrollbar";

type Props = {||};

type State = {||};

export default class HudToolbar extends React.Component<Props, State> {
  render() {
    return (
      <HudToolbarScrollbar
        className="dd__toolbar dd__toolbar--hud"
        style={{
          "--dd-toolbar-elements": 40
        }}
      >
        <button className="dd__button dd__button--toolbar dd__button--icon dd__button--strength">
          Brutalna siła
        </button>
        <button className="dd__button dd__button--toolbar dd__button--icon dd__button--magic">
          Czar
        </button>
        <button className="dd__button dd__button--toolbar dd__button--icon dd__button--prayer">
          Modlitwa
        </button>
        <button className="dd__button dd__button--toolbar dd__button--toolbar dd__button--icon dd__button--backpack">
          Ekwipunek
        </button>
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />
        <button className="dd__button dd__button--toolbar" />

        <div className="dd__toolbar__scroll-indicator" />
      </HudToolbarScrollbar>
    );
  }
}
