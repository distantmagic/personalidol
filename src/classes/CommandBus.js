// @flow

import Clock from './Clock';
import Command from './Command';
import CommandBuffer from './CommandBuffer';

export default class CommandBus {
  clock: Clock;
  commandBuffer: CommandBuffer;

  constructor(clock: Clock, commandBuffer: CommandBuffer) {
    this.clock = clock;
    this.commandBuffer = commandBuffer;
  }

  source(command: Command): void {
    this.clock.tick();
    this.commandBuffer.add(command);
  }
}
