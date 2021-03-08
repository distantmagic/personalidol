import { KeyboardIndices } from "./KeyboardIndices.enum";

export function isKeyboardKeyName(key: string): key is keyof typeof KeyboardIndices {
  return KeyboardIndices.hasOwnProperty(key);
}
