// @flow

import * as React from "react";

import HudSceneOverlayError from "./HudSceneOverlayError";

import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";
import type { THREELoadingManager } from "../framework/interfaces/THREELoadingManager";

type Props = {|
  threeLoadingManager: THREELoadingManager,
|};

export default function HudSceneOverlay(props: Props) {
  const [resourcesLoadingState, setResourcesLoadingState] = React.useState<?ResourcesLoadingState>(null);

  React.useEffect(
    function() {
      props.threeLoadingManager.onResourcesLoadingStateChange(setResourcesLoadingState);

      return function() {
        props.threeLoadingManager.offResourcesLoadingStateChange(setResourcesLoadingState);
      };
    },
    [props.threeLoadingManager]
  );

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
