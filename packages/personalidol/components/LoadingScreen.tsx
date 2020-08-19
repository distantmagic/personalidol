import { h } from "preact";

type Props = {
  comment: string;
  progress: number;
};

export function LoadingScreen(props: Props) {
  const progress = Math.round(props.progress * 100);

  return (
    <main class="loading-screen">
      <div class="loading-screen__comment">Loading {props.comment} ...</div>
      <div class="loading-screen__progress">{progress}%</div>
      <div
        class="loading-screen__progress-bar"
        style={{
          "--progress": `${progress}%`,
        }}
      >
        <div class="loading-screen__progress-bar__progress" />
      </div>
    </main>
  );
}
