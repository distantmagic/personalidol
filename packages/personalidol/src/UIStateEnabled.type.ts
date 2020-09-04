import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";
import type { LoadingManagerProgress } from "@personalidol/loading-manager/src/LoadingManagerProgress.type";

export type UIStateEnabled = {
  cMainMenu: {
    enabled: true;
    props: {};
  };
  cLoadingError: {
    enabled: true;
    props: {
      loadingError: LoadingError;
    };
  };
  cLoadingScreen: {
    enabled: true;
    props: {
      loadingManagerProgress: LoadingManagerProgress;
    };
  };
  cOptions: {
    enabled: true;
    props: {};
  };
  cPointerFeedback: {
    enabled: true;
    props: {};
  };
};
