import * as React from "react";

import HudAsidePortrait from "src/components/HudAsidePortrait";

import imagePortraitArlance from "src/assets/portrait-arlance.jpg";
import imagePortraitMoore from "src/assets/portrait-moore.jpg";
import imagePortraitCircassia from "src/assets/portrait-circassia.jpg";

type Props = {};

export default React.memo<Props>(function HudAside(props: Props) {
  return (
    <div className="dd__aside dd__aside--hud dd__frame">
      <HudAsidePortrait isActive={true} name="Arlance" src={imagePortraitArlance} />
      <HudAsidePortrait isActive={false} name="Moore" src={imagePortraitMoore} />
      <HudAsidePortrait isActive={false} name="Circassia" src={imagePortraitCircassia} />
    </div>
  );
});
