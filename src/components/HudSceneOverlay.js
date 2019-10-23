// @flow

import * as React from "react";

import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";

type Props = {|
  resourcesLoadingState: ResourcesLoadingState,
|};

export default function HudSceneOverlay(props: Props) {
  if (props.resourcesLoadingState.isFailed()) {
    return <div className="dd__loader dd__loader--error dd__scene__loader">Failed loading assets.</div>;
  }

  if (props.resourcesLoadingState.isLoading()) {
    return (
      <div className="dd__loader dd__scene__loader">
        Loading asset {props.resourcesLoadingState.getItemsLoaded()}
        {" of "}
        {props.resourcesLoadingState.getItemsTotal()}
        ...
      </div>
    );
  }

  return null;
}
