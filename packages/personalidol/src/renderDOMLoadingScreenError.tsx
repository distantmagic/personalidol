import { h } from "preact";

import type { ComponentChild } from "preact";

import type { LoadingError } from "@personalidol/loading-manager/src/LoadingError.type";

type Props = LoadingError;

export function renderDOMLoadingScreenError(props: Props): ComponentChild {
  return (
    <div class="pi__loading-screen pi__loading-screen--error">
      <p>error while loading {props.item.comment}</p>
      <p>{props.item.id}</p>
      <p>{props.error.message}</p>
      <p>{props.error.stack}</p>
    </div>
  );
}
