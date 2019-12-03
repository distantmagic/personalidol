// @flow

import * as React from "react";

import type { LoadingManager } from "../framework/interfaces/LoadingManager";
import type { LoadingManagerState } from "../framework/interfaces/LoadingManagerState";

export default function useLoadingManagerState(loadingManager: LoadingManager): LoadingManagerState {
  const [loadingManagerState, setLoadingManagerState] = React.useState<LoadingManagerState>(loadingManager.getState());

  React.useEffect(
    function() {
      loadingManager.onChange(setLoadingManagerState);

      return function() {
        loadingManager.offChange(setLoadingManagerState);
      };
    },
    [loadingManager]
  );

  return loadingManagerState;
}
