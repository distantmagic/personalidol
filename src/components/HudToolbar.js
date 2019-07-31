// @flow

import * as React from "react";

import HudToolbarScrollbar from "./HudToolbarScrollbar";

type Props = {|
  hasDebugger: boolean,
  hasDialogue: boolean,
|};

export default React.memo<Props>(function HudToolbar(props: Props) {
  return (
    <HudToolbarScrollbar hasDebugger={props.hasDebugger} hasDialogue={props.hasDialogue}>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--dialogue">Rozmowa</button>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--strength">Brutalna siła</button>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--prayer">Modlitwa</button>
      <button className="dd__button dd__button--toolbar dd__button--icon dd__button--magic">Czar</button>
      <button className="dd__button dd__button--toolbar dd__button--toolbar dd__button--icon dd__button--backpack">
        Ekwipunek
      </button>
      <button className="dd__button dd__button--toolbar dd__button--toolbar dd__button--icon dd__button--skill">
        Umiejętność specjalna
      </button>
    </HudToolbarScrollbar>
  );
});
