export type MessageEventRouter = {
  [key: string]: <Message extends ExtendableMessageEvent | MessageEvent = MessageEvent>(
    message: any,
    originalEvent: Message
  ) => void;
};
