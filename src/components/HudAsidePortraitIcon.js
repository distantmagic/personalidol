// @flow

import * as React from "react";
import { NavLink } from "react-router-dom";

import imageIconPrayer from "../assets/icon-prayer.png";

type Props = {|
  name: string,
|};

export default function HudAsidePortraitIcon(props: Props) {
  return (
    <li className="dd__aside__portrait__status dd__frame dd__frame--inset">
      <NavLink className="dd__aside__portrait__status__icon" to={`/character/${props.name.toLowerCase()}`}>
        <img alt="prayer" className="dd__aside__portrait__status__icon__image" src={imageIconPrayer} />
        <div className="dd__aside__portrait__status__icon__tooltip dd__tooltip">{props.name} modli się śpiewając "Hymn do nieznanego boga"</div>
      </NavLink>
    </li>
  );
}
