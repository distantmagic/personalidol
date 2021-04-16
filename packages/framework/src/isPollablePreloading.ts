import type { PollablePreloading } from "./PollablePreloading.interface";

export function isPollablePreloading(object: object): object is PollablePreloading {
  return true === (object as PollablePreloading).isPollablePreloading;
}
