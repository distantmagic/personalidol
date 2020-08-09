import { h } from "preact";

import type { ComponentChild } from "preact";

type Props = {
  comment: string;
  progress: number;
};

export function renderDOMLoadingScreen(props: Props): ComponentChild {
  const progress = Math.round(props.progress * 100);

  return (
    <div class="pi__loading-screen" style={{
      "--progress": `${progress}%`
    }}>
      <p class="pi__loading-screen__label">
        <span class="pi__loading-screen__label__comment">
          Loading {props.comment}...
        </span>
        <span class="pi__loading-screen__label__progress">
          {progress}%
        </span>
      </p>
      <div class="pi__loading-screen__progress-bar">
        <div class="pi__loading-screen__progress-bar__progress" />
      </div>
    </div>
  );
}
