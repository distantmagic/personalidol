// @flow

import type { CancelToken } from "../interfaces/CancelToken";
import type { EventListenerGenerator as EventListenerGeneratorInterface } from "../interfaces/EventListenerGenerator";
import type { EventListenerSet } from "../interfaces/EventListenerSet";

type GeneratorBuffer<Arguments> = Array<{|
  isUtilized: boolean,
  promise: Promise<Arguments>,
  resolve: Arguments => void,
|}>;

function produceBuffered<Arguments>(buffer: GeneratorBuffer<Arguments>): Promise<void> {
  return new Promise(resolve => {
    const bufferedPromise = new Promise(bufferedResolve => {
      requestAnimationFrame(function() {
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

export default class EventListenerGenerator<Arguments: $ReadOnlyArray<any>> implements EventListenerGeneratorInterface<Arguments> {
  +eventListenerSet: EventListenerSet<Arguments>;

  constructor(eventListenerSet: EventListenerSet<Arguments>) {
    this.eventListenerSet = eventListenerSet;
  }

  generate(cancelToken: CancelToken): AsyncGenerator<Arguments, void, void> {
    const buffer: GeneratorBuffer<Arguments> = [];

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
        this.eventListenerSet.delete(eventListener);
      }
    }

    return generator.call(this);
  }
}
