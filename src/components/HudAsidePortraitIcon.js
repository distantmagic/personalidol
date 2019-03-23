// @flow

import * as React from "react";
import autoBind from "auto-bind";
import classnames from "classnames";
import OutsideClickHandler from "react-outside-click-handler";

type Props = {|
  name: string
|};

type State = {|
  isTooltipActive: boolean
|};

export default class HudAsidePortraitIcon extends React.Component<
  Props,
  State
> {
  state = {
    isTooltipActive: false
  };

  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  onButtonClick(evt: SyntheticEvent<HTMLElement>): void {
    evt.preventDefault();

    this.setState({
      isTooltipActive: !this.state.isTooltipActive
    });
  }

  onOutsideClick() {
    this.setState({
      isTooltipActive: false
    });
  }

  render() {
    return (
      <li
        className={classnames(
          "dd__aside__portrait__status dd__frame dd__frame--inset",
          {
            "dd__aside__portrait__status--active": this.state.isTooltipActive
          }
        )}
      >
        <OutsideClickHandler
          disabled={!this.state.isTooltipActive}
          onOutsideClick={this.onOutsideClick}
        >
          <button
            className="dd__aside__portrait__status__icon"
            onClick={this.onButtonClick}
          >
            <img
              alt="prayer"
              className="dd__aside__portrait__status__icon__image"
              src="/assets/icon-prayer.svg"
            />
            <div className="dd__aside__portrait__status__icon__tooltip">
              {this.props.name} modli się śpiewając "Hymn do nieznanego boga"
            </div>
          </button>
        </OutsideClickHandler>
      </li>
    );
  }
}
