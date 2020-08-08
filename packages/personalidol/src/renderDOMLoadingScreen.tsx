import { Fragment, h } from "preact";

import type { ComponentChild } from "preact";

type Props = {
  comment: string;
  progress: number;
};

export function renderDOMLoadingScreen(props: Props): ComponentChild {
  const progress = Math.min(100, props.progress * 100);

  return (
    <div class="pi__loading-screen" style={{
      "--progress": `${progress}%`
    }}>
      <p class="pi__loading-screen__label">
        Loading {props.comment}...
      </p>
      <div class="pi__loading-screen__progress-bar">
        <div class="pi__loading-screen__progress-bar__progress">${progress}%</div>
      </div>
    </div>
  );
}
