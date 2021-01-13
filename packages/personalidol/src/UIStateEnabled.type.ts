import type { ProgressError } from "@personalidol/loading-manager/src/ProgressError.type";
import type { ProgressManagerProgress } from "@personalidol/loading-manager/src/ProgressManagerProgress.type";

export type UIStateEnabled = {
  "pi-main-menu": {
    enabled: true;
    props: {};
  };
  "pi-fatal-error": {
    enabled: true;
    props: {
      progressError: ProgressError;
    };
  };
  "pi-loading-screen": {
    enabled: true;
    props: {
      progressManagerProgress: ProgressManagerProgress;
    };
  };
  "pi-options": {
    enabled: true;
    props: {};
  };
};
