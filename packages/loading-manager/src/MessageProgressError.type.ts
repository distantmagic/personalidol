import type { MessageProgress } from "./MessageProgress.type";

export type MessageProgressError = MessageProgress & {
  message: string;
};
