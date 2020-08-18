import type { LoadingManagerItem } from "./LoadingManagerItem.type";

export type LoadingError = {
  error: {
    message: string;
    stack: string;
  };
  item: LoadingManagerItem;
};
