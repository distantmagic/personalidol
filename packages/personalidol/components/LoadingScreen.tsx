import { Fragment, h } from "preact";

import type { LoadingManagerProgress } from "@personalidol/loading-manager/src/LoadingManagerProgress.type";

type Props = {
  loadingManagerProgress: LoadingManagerProgress;
};

function _renderProgressIndicator(expectsAtLeast: number, progress: number) {
  return (
    <Fragment>
      {expectsAtLeast > 0 ? <div class="loading-screen__progress">{progress}%</div> : null}
      <div
        class="loading-screen__progress-bar"
        style={{
          "--progress": `${progress}%`,
        }}
      >
        <div class="loading-screen__progress-bar__progress" />
      </div>
    </Fragment>
  );
}

export function LoadingScreen(props: Props) {
  const progress = Math.round(props.loadingManagerProgress.progress * 100);

  return (
    <main class="loading-screen">
      <div class="loading-screen__comment">Loading {props.loadingManagerProgress.comment} ...</div>
      {_renderProgressIndicator(props.loadingManagerProgress.expectsAtLeast, progress)}
    </main>
  );
}
