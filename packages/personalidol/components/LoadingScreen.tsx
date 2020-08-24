import { Fragment, h } from "preact";

import type { LoadingManagerProgress } from "@personalidol/loading-manager/src/LoadingManagerProgress.type";

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

export function LoadingScreen(props: LoadingManagerProgress) {
  const progress = Math.round(props.progress * 100);

  return (
    <main class="loading-screen">
      <div class="loading-screen__comment">Loading {props.comment} ...</div>
      {_renderProgressIndicator(props.expectsAtLeast, progress)}
    </main>
  );
}
