// @flow

import Command from "./Command";

export default class CommandBuffer {
  queue: Array<Command>;

  add(command: Command): void {
    this.queue.push(command);
  }
}
