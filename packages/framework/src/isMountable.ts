import type { Mountable } from "./Mountable.interface";

export function isMountable(item: any): item is Mountable {
  return true === (item as Mountable).isMountable;
}
