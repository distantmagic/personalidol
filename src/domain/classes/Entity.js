// @flow

// import CommandBus from "../classes/CommandBus";

import type { Equatable } from "../interfaces/Equatable";

export default class Entity implements Equatable<Entity> {
  isEqual(other: Entity): boolean {
    return false;
  }
}
