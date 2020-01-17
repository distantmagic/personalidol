import * as React from "react";

import LoadingManager from "src/framework/interfaces/LoadingManager";
import LoadingManagerState from "src/framework/interfaces/LoadingManagerState";

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
