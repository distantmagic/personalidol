import type { MessageProgress } from "./MessageProgress.type";

export type MessageProgressChange = MessageProgress & {
  loaded: number;
  total: number;
};
