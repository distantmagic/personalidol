import { default as JSONRPCException } from "src/framework/classes/Exception/JSONRPC";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import JSONRPCGeneratorChunkResponse from "src/framework/interfaces/JSONRPCGeneratorChunkResponse";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IJSONRPCClientGeneratorBuffer } from "src/framework/interfaces/JSONRPCClientGeneratorBuffer";

export default class JSONRPCClientGeneratorBuffer<T> implements HasLoggerBreadcrumbs, IJSONRPCClientGeneratorBuffer<T> {
  readonly buffer: Map<string, JSONRPCGeneratorChunkResponse<T>> = new Map();
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  private flushable: JSONRPCGeneratorChunkResponse<T>[] = [];
  private lastSent: null | JSONRPCGeneratorChunkResponse<T> = null;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  add(chunk: JSONRPCGeneratorChunkResponse<T>): void {
    const lastSent = this.lastSent;

    if (chunk.isHead() || (lastSent && lastSent.hasNext() && lastSent.getNext() === chunk.getChunk())) {
      this.flushable.push(chunk);
      this.lastSent = chunk;
    } else {
      // it should wait for the missing one
      this.buffer.set(chunk.getChunk(), chunk);
    }
  }

  *flush(): Generator<JSONRPCGeneratorChunkResponse<T>> {
    for (let flushable of this.flushable) {
      yield flushable;
      this.lastSent = flushable;
    }

    this.flushable = [];

    if (!this.hasLastSent() || this.buffer.size < 1) {
      return;
    }

    let lastSent: JSONRPCGeneratorChunkResponse<T> = this.getLastSent();

    if (!lastSent.hasNext()) {
      return;
    }

    let next: string = lastSent.getNext();

    // prettier-ignore
    for (
      let buffered = this.buffer.get(next);
      buffered && next && this.buffer.has(next);
      buffered = this.buffer.get(next)
    ) {
      yield buffered;

      this.buffer.delete(buffered.getChunk());
      this.lastSent = lastSent = buffered;

      if (!buffered.hasNext()) {
        return;
      }

      next = buffered.getNext();
    }
  }

  getLastSent(): JSONRPCGeneratorChunkResponse<T> {
    const lastSent = this.lastSent;

    if (!lastSent) {
      throw new JSONRPCException(this.loggerBreadcrumbs.add("getLastSent"), "Last sent is not defined but it was expected.");
    }

    return lastSent;
  }

  hasLastSent(): boolean {
    return null !== this.lastSent;
  }

  isExpectingMore(): boolean {
    const lastSent = this.lastSent;

    if (!lastSent) {
      return true;
    }

    return this.buffer.size > 0 || lastSent.hasNext();
  }
}
