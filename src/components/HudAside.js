// @flow

import * as React from "react";

import HudAsidePortrait from "./HudAsidePortrait";

type Props = {||};

export default React.memo<Props>(function HudAside(props: Props) {
  return (
    <div className="dd__aside dd__aside--hud dd__frame">
      <HudAsidePortrait isActive={true} name="Arlance" src="/assets/portrait-arlance.jpg" />
      <HudAsidePortrait isActive={false} name="Moore" src="/assets/portrait-moore.jpg" />
      <HudAsidePortrait isActive={false} name="Circassia" src="/assets/portrait-circassia.jpg" />
    </div>
  );
});
