// @flow

import EventEmitter from "eventemitter3";

import type { CancelToken } from "../interfaces/CancelToken";
import type { CancelTokenQuery as CancelTokenQueryInterface } from "../interfaces/CancelTokenQuery";
import type { Query } from "../interfaces/Query";

export default class CancelTokenQuery<T>
  implements CancelTokenQueryInterface<T> {
  cancelToken: CancelToken;
  eventEmitter: EventEmitter;
  query: Query<T>;

  constructor(cancelToken: CancelToken, query: Query<T>) {
    this.cancelToken = cancelToken;
    this.eventEmitter = new EventEmitter();
    this.query = query;
  }

  execute(): Promise<T> {
    return this.query.execute(this.cancelToken).then(result => {
      this.eventEmitter.emit("executed", result);

      return result;
    });
  }

  isCancelled(): boolean {
    return this.cancelToken.isCancelled();
  }

  isEqual(other: CancelTokenQuery<T>) {
    return this.query.isEqual(other.query);
  }

  async onExecuted(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.cancelToken.onCancelled().then(reject);
      this.eventEmitter.once("executed", resolve);
    });
  }
}
