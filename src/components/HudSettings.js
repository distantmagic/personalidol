// @flow

import * as React from "react";

type Props = {||};

export default React.memo<Props>(function HudSettings(props: Props) {
  function onToggleFullScreenClick(evt: SyntheticEvent<HTMLButtonElement>) {
    evt.preventDefault();

    if (document.fullscreenElement) {
      return void document.exitFullscreen();
    }

    const body = document.body;

    // for type-checking
    // flow-typed seems to be a bit paranoid sometimes
    if (body) {
      body.requestFullscreen();
    }
  }

  return (
    <div className="dd__settings dd__settings--hud dd__frame">
      <button className="dd__button dd__button--icon dd__button--cogs" disabled>
        Settings
      </button>
      <button className="dd__button dd__button--icon dd__button--magnifying-glass" disabled={!document.fullscreenEnabled} onClick={onToggleFullScreenClick}>
        Toggle Fullscreen
      </button>
    </div>
  );
});
