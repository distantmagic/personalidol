// @flow

import * as React from "react";

import HudSceneOverlayError from "./HudSceneOverlayError";

import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";

type Props = {|
  resourcesLoadingState: ?ResourcesLoadingState,
|};

export default function HudSceneOverlay(props: Props) {
  const resourcesLoadingState = props.resourcesLoadingState;

  if (!resourcesLoadingState) {
    return null;
  }

  if (resourcesLoadingState.isFailed()) {
    return <HudSceneOverlayError>Failed loading assets.</HudSceneOverlayError>;
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
