// @flow

import CommandBus from '../classes/CommandBus';
import QueryBus from '../classes/QueryBus';

import type { Equatable } from '../interfaces/Equatable';

export default class Entity implements Equatable<Entity> {
  commandBus: CommandBus;
  queryBus: QueryBus;

  constructor(commandBus: CommandBus, queryBus: QueryBus) {
    this.commandBus = commandBus;
    this.queryBus = queryBus;
  }

  isEqual(other: Entity): boolean {
    return false;
  }
}
