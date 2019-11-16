// @flow

import * as React from "react";
import Image from "react-image";
import classnames from "classnames";

import HudAsidePortraitIcon from "./HudAsidePortraitIcon";

type Props = {|
  isActive: boolean,
  name: string,
  src: string,
|};

function HudAsidePortraitLoader() {
  return <div className="dd__frame dd__frame--inset dd__aside__portrait__image dd__aside__portrait__image--loading" />;
}

export default function HudAsidePortrait(props: Props) {
  return (
    <div
      className={classnames("dd__aside__portrait", {
        "dd__aside__portrait--active": props.isActive,
      })}
    >
      <Image
        alt="arthurian knight"
        className="dd__aside__portrait__image dd__aside__portrait__image--loaded"
        loader={<HudAsidePortraitLoader />}
        src={props.src}
      />
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
