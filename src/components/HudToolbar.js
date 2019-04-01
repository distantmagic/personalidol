// @flow

import * as React from "react";

import HudToolbarScrollbar from "./HudToolbarScrollbar";

type Props = {||};

export default function HudToolbar(props: Props) {
  return (
    <HudToolbarScrollbar
      className="dd__frame dd__toolbar dd__toolbar--hud"
      style={{
        "--dd-toolbar-elements": 6
      }}
    >
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--dialogue">
        Rozmowa
      </button>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--strength">
        Brutalna siła
      </button>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--prayer">
        Modlitwa
      </button>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--magic">
        Czar
      </button>
      <button className="dd__button dd__button--toolbar dd__button--toolbar dd__button--icon dd__button--backpack">
        Ekwipunek
      </button>
      <button className="dd__button dd__button--toolbar dd__button--toolbar dd__button--icon dd__button--skill">
        Umiejętność specjalna
      </button>

      <div className="dd__toolbar__scroll-indicator" />
    </HudToolbarScrollbar>
  );
}
