// @flow

import * as React from "react";
import autoBind from "auto-bind";

type Props = {|
  children: React.Node
|};

type State = {||};

export default class HudModalOverlay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  onOverlayClick(evt: SyntheticEvent<HTMLElement>): void {
    evt.preventDefault();

    window.location.hash = "#/";
  }

  render() {
    return (
      <div className="dd__modal">
        <div className="dd__modal__overlay" onClick={this.onOverlayClick} />
        <div className="dd__modal__content">{this.props.children}</div>
      </div>
    );
  }
}
