// @flow

import ElementPosition from "../../framework/classes/ElementPosition";

import type { ElementPosition as ElementPositionInterface } from "../../framework/interfaces/ElementPosition";
import type { PlayerModel as PlayerModelInterface } from "../interfaces/PlayerModel";

export default class PlayerModel implements PlayerModelInterface {
  currentPosition: ElementPositionInterface<"tile">;
  targetPosition: ElementPositionInterface<"tile">;

  constructor(
    currentPosition: ElementPositionInterface<"tile"> = new ElementPosition(0, 0, 0),
    targetPosition: ElementPositionInterface<"tile"> = new ElementPosition(0, 0, 0)
  ) {
    this.currentPosition = currentPosition;
    this.targetPosition = targetPosition;
  }

  getCurrentPosition(): ElementPositionInterface<"tile"> {
    return this.currentPosition;
  }

  getTargetPosition(): ElementPositionInterface<"tile"> {
    return this.targetPosition;
  }

  setCurrentPosition(elementPosition: ElementPositionInterface<"tile">): void {
    this.currentPosition = elementPosition;
  }

  setTargetPosition(elementPosition: ElementPositionInterface<"tile">): void {
    this.targetPosition = elementPosition;
  }
}
