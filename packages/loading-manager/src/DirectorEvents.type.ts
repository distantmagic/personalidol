import type { DirectorEventCallback } from "./DirectorEventCallback.type";

export type DirectorEvents = {
  PRELOAD: Set<DirectorEventCallback>;
};
