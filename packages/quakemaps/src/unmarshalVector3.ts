import { isEmptyString } from "./isEmptyString";
import { UnmarshalException } from "./UnmarshalException";
import { sanitizeVector3 } from "./sanitizeVector3";

import type { Vector3 } from "three";

const REGEXP_WHITESPACE = /\s+/;

function rejectEmpty(str: string): boolean {
  return !isEmptyString(str);
}

export function unmarshalVector3(filename: string, lineno: number, marshaled: string): Vector3 {
  const parts = marshaled.split(REGEXP_WHITESPACE).filter(rejectEmpty);

  if (parts.length !== 3) {
    throw new UnmarshalException(filename, lineno, "Point must be defined by three numbers");
  }

  return sanitizeVector3(filename, lineno, parts[0], parts[1], parts[2]);
}
