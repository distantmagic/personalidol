import { SingleThreadMessageChannel } from "./SingleThreadMessageChannel";

globalThis.MessageEvent = class MessageEvent {
  data: any;

  constructor(type: string, init: any) {
    this.data = init.data;
  }
};

test("post message port1->port2", function () {
  const messageChannel = SingleThreadMessageChannel();

  messageChannel.port2.onmessage = function (message: MessageEvent) {
    expect(message.data).toBe("Hello.");
  };

  messageChannel.port1.postMessage("Hello.");
});

test("post message port2->port1", function () {
  const messageChannel = SingleThreadMessageChannel();

  messageChannel.port1.onmessage = function (message: MessageEvent) {
    expect(message.data).toBe("Hello.");
  };

  messageChannel.port2.postMessage("Hello.");
});
