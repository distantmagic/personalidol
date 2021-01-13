import type { ProgressManagerItem } from "./ProgressManagerItem.type";

export type ProgressError = {
  error: {
    message: string;
    stack: string;
  };
  item: ProgressManagerItem;
};
