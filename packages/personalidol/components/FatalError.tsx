import { h } from "preact";

import type { ComponentChild } from "preact";

type Props = {
  title: string;
  technicalDescription: ComponentChild;
  userFeedback: ComponentChild;
};

export function FatalError(props: Props) {
  return (
    <main class="fatal-error">
      <h1>{props.title}</h1>
      {props.userFeedback}
      <div class="fatal-error__error">{props.technicalDescription}</div>
    </main>
  );
}
