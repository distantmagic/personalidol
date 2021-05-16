export type MessageEventMultiRouter = {
  [key: string]: <Message extends ExtendableMessageEvent | MessageEvent>(
    messagePort: MessagePort,
    message: any,
    originalEvent: Message
  ) => void;
};
