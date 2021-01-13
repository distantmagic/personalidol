import type { Nameable } from "./Nameable.interface";

export function name(nameable: Nameable): string {
  return `${nameable.name}#${nameable.id}`;
}
