import { MessageChannel } from "worker_threads";

import { attachMultiRouter } from "./attachMultiRouter";

test("attaches router directly to the message port", function (done) {
  const messageChannel1 = new MessageChannel();
  const messageChannel2 = new MessageChannel();

  const mockCallback1 = jest.fn(function test1(messagePort: MessagePort, foo: string) {
    expect(foo).toBe("bar");
  });

  const mockCallback2 = jest.fn(function test1(messagePort: MessagePort, foo: string) {
    expect(foo).toBe("baz");

    expect(mockCallback1.mock.calls).toHaveLength(1);
    expect(mockCallback2.mock.calls).toHaveLength(1);

    done();
  });

  const routes = {
    test1: mockCallback1,
    test2: mockCallback2,
  };

  attachMultiRouter(messageChannel1.port1 as unknown as MessagePort, routes);
  attachMultiRouter(messageChannel2.port1 as unknown as MessagePort, routes);

  messageChannel1.port2.postMessage({
    test1: "bar",
  });

  messageChannel1.port2.postMessage({
    test2: "baz",
  });
});
