// @flow

import * as React from "react";

type Props = {|
  children: React.Node,
|};

export default function HudModalOverlay(props: Props) {
  function onOverlayClick(evt: SyntheticEvent<HTMLElement>): void {
    evt.preventDefault();

    window.location.hash = "#/";
  }

  return (
    <div className="dd__modal">
      <div className="dd__modal__overlay" onClick={onOverlayClick} />
      <div className="dd__modal__content">{props.children}</div>
    </div>
  );
}
