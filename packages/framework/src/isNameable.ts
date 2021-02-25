import type { Nameable } from "./Nameable.interface";

export function isNameable(item: any): item is Nameable {
  if ("object" !== typeof item) {
    return false;
  }

  if (!("id" in item) || "string" !== typeof item.id) {
    return false;
  }

  if (!("name" in item) || "string" !== typeof item.name) {
    return false;
  }

  return true;
}
