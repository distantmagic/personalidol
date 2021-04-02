import type { ViewState } from "@personalidol/views/src/ViewState.type";

export type CharacterViewState = ViewState & {
  animation: "run" | "stand";
};
