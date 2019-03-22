// @flow

import * as React from "react";
import autoBind from "auto-bind";
import classnames from "classnames";

import HudAsidePortraitIcon from "./HudAsidePortraitIcon";

type Props = {|
  isActive: boolean,
  src: string
|};

type State = {||};

export default class HudAsidePortrait extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  render() {
    return (
      <div
        className={classnames("dd__aside__portrait", {
          "dd__aside__portrait--active": this.props.isActive
        })}
      >
        <img
          alt="arthurian knight"
          className="dd__aside__portrait__image"
          src={this.props.src}
        />
        <ul className="dd__aside__portrait__statuses">
          <li className="dd__aside__portrait__status dd__frame dd__frame--inset">
            <HudAsidePortraitIcon />
          </li>
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
}
