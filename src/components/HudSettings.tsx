import * as React from "react";
import screenfull, { Screenfull } from "screenfull";
import { NavLink } from "react-router-dom";

type Props = {};

// typing quirks
const sf: Screenfull = screenfull as Screenfull;

export default React.memo<Props>(function HudSettings(props: Props) {
  function onToggleFullScreenClick(evt: React.SyntheticEvent<HTMLButtonElement>) {
    evt.preventDefault();

    if (sf.isFullscreen) {
      return void sf.exit();
    }

    sf.request(document.body);
  }

  return (
    <div className="dd__settings dd__settings--hud dd__frame">
      <NavLink activeClassName="dd__button--pressed" className="dd__button dd__button--cogs dd__button--icon" to="/settings">
        Settings
      </NavLink>
      <button className="dd__button dd__button--icon dd__button--magnifying-glass" disabled={!sf.isEnabled} onClick={onToggleFullScreenClick}>
        Toggle Fullscreen
      </button>
    </div>
  );
});
