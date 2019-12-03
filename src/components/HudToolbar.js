// @flow

import * as React from "react";

type Props = {||};

export default React.memo<Props>(function HudToolbar(props: Props) {
  return (
    <div className="dd__frame dd__toolbar dd__toolbar--hud">
      <button className="dd__button dd__button--text dd__button--toolbar">A</button>
      <button className="dd__button dd__button--text dd__button--toolbar">B</button>
      <button className="dd__button dd__button--text dd__button--toolbar">C</button>
    </div>
  );
});
