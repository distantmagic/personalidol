import { Fragment, h } from "preact";

type Props = {
  comment: string;
  progress: number;
};

export function LoadingScreen(props: Props) {
  const progress = Math.round(props.progress * 100);

  return (
    <Fragment>
      <span class="pi__font-preloader" />
      <div class="loading-screen__label__comment">Loading {props.comment} ...</div>
      <div class="loading-screen__label__progress">{progress}%</div>
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
