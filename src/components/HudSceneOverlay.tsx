import * as React from "react";
import groupBy from "lodash/groupBy";

import HudSceneOverlayComment from "src/components/HudSceneOverlayComment";
import HudSceneOverlayError from "src/components/HudSceneOverlayError";
import useLoadingManagerState from "src/effects/useLoadingManagerState";

import { LoadingManager } from "src/framework/interfaces/LoadingManager";

type Props = {
  loadingManager: LoadingManager;
};

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

  const groupedComments: ReadonlyArray<[string, ReadonlyArray<string>]> = Object.entries(groupBy(comments));

  return (
    <div className="dd__frame dd__loader dd__scene__loader">
      <ul className="dd__scene__loader__list">
        {groupedComments.map(function([comment, comments]) {
          return <HudSceneOverlayComment key={comment} comment={comment} quantity={comments.length} />;
        })}
      </ul>
    </div>
  );
});
