// @flow

import * as React from "react";
import Image from "react-image";

import imageIconPrayer from "../assets/icon-prayer.png";

type Props = {|
  name: string,
|};

export default function HudAsidePortraitIcon(props: Props) {
  return (
    <li className="dd__aside__portrait__status dd__frame dd__frame--inset">
      <a className="dd__aside__portrait__status__icon" href={`#/character/${props.name.toLowerCase()}/inventory`}>
        <Image alt="prayer" className="dd__aside__portrait__status__icon__image" src={imageIconPrayer} />
        <div className="dd__aside__portrait__status__icon__tooltip dd__tooltip">{props.name} modli się śpiewając "Hymn do nieznanego boga"</div>
      </a>
    </li>
  );
}
