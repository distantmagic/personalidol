import { UnmarshalException } from "./UnmarshalException";

import type { EntitySketchProperty } from "./EntitySketchProperty.type";

function reduceSplits(acc: string[], curr: string): Array<string> {
  if (curr.endsWith("\\")) {
    const last = acc.shift();

    acc.unshift(curr.substr(0, curr.length - 1) + '"' + last);
  } else {
    acc.unshift(curr);
  }

  return acc;
}

function sanitizeEntityPropertySplits(filename: string, lineno: number, splits: ReadonlyArray<string>): EntitySketchProperty {
  if (splits.length !== 5) {
    throw new UnmarshalException(filename, lineno, "Unexpected number of brush splits.");
  }

  return [splits[1], splits[3]];
}

export function unmarshalEntityProperty(filename: string, lineno: number, line: string) {
  const splits = line.split('"');

  if (splits.length < 5) {
    throw new UnmarshalException(filename, lineno, "Expected entity property.");
  }

  if (splits.length === 5) {
    return sanitizeEntityPropertySplits(filename, lineno, splits);
  }

  // might contain backslashes to escape strings inside properties
  const reduced = splits.reduceRight(reduceSplits, []);

  if (reduced.length !== 5) {
    throw new UnmarshalException(filename, lineno, "Expected entity property.");
  }

  return sanitizeEntityPropertySplits(filename, lineno, reduced);
}
