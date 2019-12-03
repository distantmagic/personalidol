// @flow

import * as React from "react";

import HudAsidePortrait from "./HudAsidePortrait";

import imagePortraitArlance from "../assets/portrait-arlance.jpg";
import imagePortraitMoore from "../assets/portrait-moore.jpg";
import imagePortraitCircassia from "../assets/portrait-circassia.jpg";

type Props = {||};

export default React.memo<Props>(function HudAside(props: Props) {
  return (
    <div className="dd__aside dd__aside--hud dd__frame">
      <HudAsidePortrait isActive={true} name="Arlance" src={imagePortraitArlance} />
      <HudAsidePortrait isActive={false} name="Moore" src={imagePortraitMoore} />
      <HudAsidePortrait isActive={false} name="Circassia" src={imagePortraitCircassia} />
    </div>
  );
});
