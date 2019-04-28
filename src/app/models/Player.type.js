// @flow

import type { ElementPosition } from "../../framework/interfaces/ElementPosition";

export interface Player {
  getCurrentPosition(): ElementPosition<"tile">;

  getTargetPosition(): ElementPosition<"tile">;

  setCurrentPosition(ElementPosition<"tile">): void;

  setTargetPosition(ElementPosition<"tile">): void;
}
