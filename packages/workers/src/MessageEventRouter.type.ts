export type MessageEventRouter = {
  [key: string]: (message: any) => void;
};
