// import CommandBus from "src/framework/classes/CommandBus";

import Equatable from "src/framework/interfaces/Equatable";

export default class Entity implements Equatable<Entity> {
  isEqual(other: Entity): boolean {
    return false;
  }
}
