// @flow

import * as React from "react";

import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";

type Props = {|
  resourcesLoadingState: ?ResourcesLoadingState,
|};

export default function HudSceneOverlay(props: Props) {
  const resourcesLoadingState = props.resourcesLoadingState;

  if (!resourcesLoadingState) {
    return (
      <div className="dd__loader dd__scene__loader">
        Loading scene...
      </div>
    );
  }

  if (resourcesLoadingState.isFailed()) {
    return (
      <div className="dd__loader dd__loader--error dd__scene__loader">
        Failed loading assets.
      </div>
    );
  }

  if (resourcesLoadingState.isLoading()) {
    return (
      <div className="dd__loader dd__scene__loader">
        Loading asset {resourcesLoadingState.getItemsLoaded()}
        {" of "}
        {resourcesLoadingState.getItemsTotal()}
        ...
      </div>
    );
  }

  return null;
}
