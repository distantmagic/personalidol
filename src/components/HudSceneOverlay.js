// @flow

import * as React from "react";
import groupBy from "lodash/groupBy";

import HudSceneOverlayComment from "./HudSceneOverlayComment";
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

  // $FlowFixMe
  const groupedComments: $ReadOnlyArray<[string, $ReadOnlyArray<string>]> = Object.entries(groupBy(comments));

  return (
    <div className="dd__frame dd__loader dd__scene__loader">
      <ul className="dd__scene__loader__list">
        {groupedComments.map(([comment, comments]) => (
          <HudSceneOverlayComment key={comment} comment={comment} quantity={comments.length} />
        ))}
      </ul>
    </div>
  );
});
