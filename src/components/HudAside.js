// @flow

import * as React from "react";
import autoBind from "auto-bind";

import HudAsidePortrait from "./HudAsidePortrait";

type Props = {||};

type State = {||};

export default class HudAside extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  render() {
    return (
      <div className="dd__aside dd__aside--hud dd__frame">
        <HudAsidePortrait
          isActive={true}
          src="/assets/portrait-arthurian-knight.png"
        />
        <HudAsidePortrait
          isActive={false}
          src="/assets/portrait-eduard-charlemont-moorish-chief.jpg"
        />
        <HudAsidePortrait
          isActive={false}
          src="/assets/portrait-veiled-circassian-beauty.jpg"
        />
      </div>
    );
  }
}
