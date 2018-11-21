// @flow

import Command from "./Command";
import CommandBuffer from "./CommandBuffer";

export default class CommandBus {
  commandBuffer: CommandBuffer;

  constructor(commandBuffer: CommandBuffer) {
    this.commandBuffer = commandBuffer;
  }

  source(command: Command): void {
    this.commandBuffer.add(command);
  }
}
