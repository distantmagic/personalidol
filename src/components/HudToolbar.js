// @flow

import * as React from "react";
import classnames from "classnames";

type Props = {|
  isModalOpened: boolean,
|};

export default React.memo<Props>(function HudToolbar(props: Props) {
  return (
    <div
      className={classnames("dd__frame dd__toolbar dd__toolbar--hud", {
        dd__blur: props.isModalOpened,
      })}
    >
      <button className="dd__button dd__button--toolbar">A</button>
      <button className="dd__button dd__button--toolbar">B</button>
      <button className="dd__button dd__button--toolbar">C</button>
    </div>
  );
});
