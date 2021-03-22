import { KeyboardIndices } from "./KeyboardIndices.enum";

import type { KeyboardKeyName } from "./KeyboardKeyName.type";

export function isKeyboardKeyName(key: string): key is KeyboardKeyName {
  return KeyboardIndices.hasOwnProperty(key);
}
