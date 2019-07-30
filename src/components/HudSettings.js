// @flow

import * as React from "react";

type Props = {||};

export default React.memo<Props>(function HudAside(props: Props) {
  return (
    <div className="dd__settings dd__settings--hud dd__frame">
      <button className="dd__button dd__button--icon dd__button--cogs">Ustawienia</button>
      <button className="dd__button dd__button--icon dd__button--cogs">Ustawienia</button>
    </div>
  );
});
