// @flow

import QueryObserver from "./QueryObserver";

export default class CommandBuffer {
  queue: Array<QueryObserver<any>>;

  add(queryObserver: QueryObserver<any>): void {
    this.queue.push(queryObserver);
  }
}
