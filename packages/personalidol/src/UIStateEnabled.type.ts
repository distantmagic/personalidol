import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";
import type { LoadingManagerProgress } from "@personalidol/loading-manager/src/LoadingManagerProgress.type";

export type UIStateEnabled = {
  "pi-main-menu": {
    enabled: true;
    props: {};
  };
  "pi-fatal-error": {
    enabled: true;
    props: {
      loadingError: LoadingError;
    };
  };
  "pi-loading-screen": {
    enabled: true;
    props: {
      loadingManagerProgress: LoadingManagerProgress;
    };
  };
  "pi-options": {
    enabled: true;
    props: {};
  };
};
