// @flow

import * as React from "react";

import HudSceneOverlayError from "./HudSceneOverlayError";

import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { LoadingManagerState } from "../framework/interfaces/LoadingManagerState";

type Props = {|
  loadingManager: LoadingManager,
|};

export default React.memo<Props>(function HudSceneOverlay(props: Props) {
  const [loadingManagerState, setLoadingManagerState] = React.useState<LoadingManagerState>(props.loadingManager.getState());
  const comments = loadingManagerState.getComments();

  React.useEffect(
    function() {
      props.loadingManager.onChange(setLoadingManagerState);

      return function() {
        props.loadingManager.offChange(setLoadingManagerState);
      };
    },
    [props.loadingManager]
  );

  if (loadingManagerState.isFailed()) {
    return <HudSceneOverlayError>Failed loading assets.</HudSceneOverlayError>;
  }

  if (!loadingManagerState.isLoading()) {
    return null;
  }

  if (comments.length < 1) {
    return <div className="dd__frame dd__loader dd__scene__loader">Loading...</div>;
  }

  return (
    <div className="dd__frame dd__loader dd__scene__loader">
      <ul className="dd__scene__loader__list">
        {comments.map(comment => (
          <li key={comment}>{comment}...</li>
        ))}
      </ul>
    </div>
  );
});
