import { CancelToken } from "../interfaces/CancelToken";
import { EventListenerGenerator as EventListenerGeneratorInterface } from "../interfaces/EventListenerGenerator";
import { EventListenerSet } from "../interfaces/EventListenerSet";

type GeneratorBuffer<Arguments> = Array<{
  isUtilized: boolean;
  promise: Promise<Arguments>;
  resolve: (args: Arguments) => void;
}>;

function produceBuffered<Arguments>(buffer: GeneratorBuffer<Arguments>): Promise<void> {
  return new Promise(resolve => {
    const bufferedPromise = new Promise<Arguments>(bufferedResolve => {
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

export default class EventListenerGenerator<Arguments extends ReadonlyArray<any>> implements EventListenerGeneratorInterface<Arguments> {
  readonly eventListenerSet: EventListenerSet<Arguments>;

  constructor(eventListenerSet: EventListenerSet<Arguments>) {
    this.eventListenerSet = eventListenerSet;
  }

  generate(cancelToken: CancelToken): AsyncGenerator<Arguments, void, void> {
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
