import { h } from "preact";

import type { LoadingManagerProgress } from "@personalidol/loading-manager/src/LoadingManagerProgress.type";

type Props = {
  loadingManagerProgress: LoadingManagerProgress;
};

export function LoadingScreen(props: Props) {
  return <pi-loading-progress progress-comment={`Loading ${props.loadingManagerProgress.comment} ...`} progress-value={String(props.loadingManagerProgress.progress)} />;
}
