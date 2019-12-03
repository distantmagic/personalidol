// @flow

import * as React from "react";

import HudSceneOverlayError from "./HudSceneOverlayError";
import useLoadingManagerState from "../effects/useLoadingManagerState";

import type { LoadingManager } from "../framework/interfaces/LoadingManager";

type Props = {|
  loadingManager: LoadingManager,
|};

export default React.memo<Props>(function HudSceneOverlay(props: Props) {
  const loadingManagerState = useLoadingManagerState(props.loadingManager);

  if (loadingManagerState.isFailed()) {
    return <HudSceneOverlayError>Failed loading assets.</HudSceneOverlayError>;
  }

  if (!loadingManagerState.isLoading()) {
    return null;
  }

  const comments = loadingManagerState.getComments();

  if (comments.length < 1) {
    return <div className="dd__frame dd__loader dd__scene__loader">Loading...</div>;
  }

  return (
    <div className="dd__frame dd__loader dd__scene__loader">
      <ul className="dd__scene__loader__list">
        {comments.map((comment, index) => (
          <li key={index}>{comment}...</li>
        ))}
      </ul>
    </div>
  );
});
