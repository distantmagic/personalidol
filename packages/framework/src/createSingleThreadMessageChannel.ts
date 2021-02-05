import { SingleThreadMessageChannel } from "./SingleThreadMessageChannel";

export function createSingleThreadMessageChannel(): MessageChannel {
  return SingleThreadMessageChannel();
}
