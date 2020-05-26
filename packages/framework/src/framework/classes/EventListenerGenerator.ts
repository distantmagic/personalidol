import cancelable from "src/framework/decorators/cancelable";

import type CancelToken from "src/framework/interfaces/CancelToken";
import type EventListenerSet from "src/framework/interfaces/EventListenerSet";
import type { default as IEventListenerGenerator } from "src/framework/interfaces/EventListenerGenerator";

type GeneratorBuffer<Arguments> = Array<{
  isUtilized: boolean;
  promise: Promise<Arguments>;
  resolve: (args: Arguments) => void;
}>;

function produceBuffered<Arguments>(buffer: GeneratorBuffer<Arguments>): Promise<void> {
  return new Promise((resolve) => {
    const bufferedPromise = new Promise<Arguments>((bufferedResolve) => {
      requestAnimationFrame(function () {
        buffer.push({
          isUtilized: false,
          promise: bufferedPromise,
          resolve: bufferedResolve,
        });
        resolve();
      });
    });
  });
}

export default class EventListenerGenerator<Arguments extends ReadonlyArray<any>> implements IEventListenerGenerator<Arguments> {
  readonly eventListenerSet: EventListenerSet<Arguments>;

  constructor(eventListenerSet: EventListenerSet<Arguments>) {
    this.eventListenerSet = eventListenerSet;
  }

  // @cancelable()
  generate(cancelToken: CancelToken): AsyncGenerator<Arguments> {
    const buffer: GeneratorBuffer<Arguments> = [];
    const self = this;

    async function eventListener(...args: Arguments) {
      await produceBuffered(buffer);

      for (let buffered of buffer) {
        if (!buffered.isUtilized) {
          buffered.isUtilized = true;
          buffered.resolve(args);

          return;
        }
      }
    }

    this.eventListenerSet.add(eventListener);

    async function* generator() {
      await produceBuffered(buffer);

      try {
        while (!cancelToken.isCanceled()) {
          yield await buffer[0].promise;
          buffer.shift();
        }
      } finally {
        self.eventListenerSet.delete(eventListener);
      }
    }

    return generator();
  }
}
