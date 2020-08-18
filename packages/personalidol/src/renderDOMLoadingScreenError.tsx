import { h } from "preact";

import type { ComponentChild } from "preact";

import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";

type Props = LoadingError;

export function renderDOMLoadingScreenError(props: Props): ComponentChild {
  return (
    <div class="pi__loading-screen pi__loading-screen--error">
      {props.error.message}<br />
      {props.error.stack}
    </div>
  );
}
