import { Fragment, h } from "preact";

import type { ComponentChild } from "preact";

type Props = {
  comment: string;
  progress: number;
};

export function renderDOMLoadingScreen(props: Props): ComponentChild {
  const progress = Math.round(props.progress * 100);

  return (
    <Fragment>
      <span class="pi__font-preloader" />
      <div class="pi__loading-screen__label__comment">
        Loading {props.comment}{" "}...
      </div>
      <div class="pi__loading-screen__label__progress">
        {progress}%
      </div>
      <div class="pi__loading-screen__progress-bar" style={{
        "--progress": `${progress}%`
      }}>
        <div class="pi__loading-screen__progress-bar__progress" />
      </div>
    </Fragment>
  );
}
