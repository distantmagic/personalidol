// @flow

import * as React from "react";
import autoBind from "auto-bind";

type Props = {||};

type State = {||};

export default class HudAsidePortraitIcon extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  render() {
    return (
      <div className="dd__aside__portrait__status__icon">
        <img
          alt="prayer"
          className="dd__aside__portrait__status__icon__image"
          src="/assets/icon-prayer.svg"
        />
        <div className="dd__aside__portrait__status__icon__tooltip">
          Laezzis modli się śpiewając "Hymn do nieznanego boga"
        </div>
      </div>
    );
  }
}
