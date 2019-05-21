// @flow

import * as React from "react";

type Props = {|
  isFailed: boolean,
  isAttaching: boolean,
  isLoading: boolean,
  itemsLoaded: number,
  itemsTotal: number,
|};

export default function HudSceneCanvasOverlay(props: Props) {
  if (props.isFailed) {
    return <div className="dd__loader dd__loader--error dd__scene__loader">Failed loading assets.</div>;
  }

  if (props.isLoading) {
    return (
      <div className="dd__loader dd__scene__loader">
        Loading asset {props.itemsLoaded}
        {" of "}
        {props.itemsTotal}
        ...
      </div>
    );
  }

  if (props.isAttaching) {
    return <div className="dd__loader dd__scene__loader">Loading scene...</div>;
  }

  return null;
}
