// @flow

import * as React from "react";
import classnames from "classnames";

import HudAsidePortraitIcon from "./HudAsidePortraitIcon";

type Props = {|
  isActive: boolean,
  name: string,
  src: string,
|};

export default function HudAsidePortrait(props: Props) {
  return (
    <div
      className={classnames("dd__aside__portrait", {
        "dd__aside__portrait--active": props.isActive,
      })}
    >
      <img alt="arthurian knight" className="dd__aside__portrait__image" src={props.src} />
      <ul className="dd__aside__portrait__statuses">
        <HudAsidePortraitIcon name={props.name} />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
        <li className="dd__aside__portrait__status dd__frame dd__frame--inset" />
      </ul>
    </div>
  );
}
