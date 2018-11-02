// @flow

import CommandBus from '../classes/CommandBus';

import type { Equatable } from '../interfaces/Equatable';

export default class Entity implements Equatable<Entity> {
  commandBus: CommandBus;

  constructor(commandBus: CommandBus) {
    this.commandBus = commandBus;
  }

  isEqual(other: Entity): boolean {
    return false;
  }
}
