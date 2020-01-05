// @flow

import * as React from "react";
import screenfull from "screenfull";
import { NavLink } from "react-router-dom";

type Props = {||};

export default React.memo<Props>(function HudSettings(props: Props) {
  function onToggleFullScreenClick(evt: SyntheticEvent<HTMLButtonElement>) {
    evt.preventDefault();

    if (screenfull.isFullscreen) {
      return void screenfull.exit();
    }

    screenfull.request(document.body);
  }

  return (
    <div className="dd__settings dd__settings--hud dd__frame">
      <NavLink activeClassName="dd__button--pressed" className="dd__button dd__button--cogs dd__button--icon" to="/settings">
        Settings
      </NavLink>
      <button className="dd__button dd__button--icon dd__button--magnifying-glass" disabled={!screenfull.isEnabled} onClick={onToggleFullScreenClick}>
        Toggle Fullscreen
      </button>
    </div>
  );
});
