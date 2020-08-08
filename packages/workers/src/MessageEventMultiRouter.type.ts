export type MessageEventMultiRouter = {
  [key: string]: (messagePort: MessagePort, message: any) => void;
};
