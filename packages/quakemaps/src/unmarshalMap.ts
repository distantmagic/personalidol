import { isEmptyString } from "./isEmptyString";
import { unmarshalEntityProperty } from "./unmarshalEntityProperty";
import { UnmarshalException } from "./UnmarshalException";
import { unmarshalHalfSpace } from "./unmarshalHalfSpace";

import type { Brush } from "./Brush.type";
import type { EntitySketch } from "./EntitySketch.type";

const REGEXP_NEWLINE = /\r?\n/;

function isClosingBracket(line: string): boolean {
  return line.startsWith("}");
}

function isComment(line: string): boolean {
  return line.startsWith("//");
}

function isOpeningBracket(line: string): boolean {
  return line.startsWith("{");
}

export function* unmarshalMap(filename: string, content: string): Generator<EntitySketch> {
  const lines: ReadonlyArray<string> = content.split(REGEXP_NEWLINE);
  let currentBrushSketch: null | Brush = null;
  let currentEntitySketch: null | EntitySketch = null;

  for (let lineno = 0; lineno < lines.length; lineno += 1) {
    const line = lines[lineno].trim();

    if (isComment(line) || isEmptyString(line)) {
      continue;
    }

    if (isOpeningBracket(line)) {
      if (currentBrushSketch) {
        throw new UnmarshalException(filename, lineno, "Unexpected opening bracket.");
      }

      if (currentEntitySketch) {
        currentBrushSketch = {
          halfSpaces: [],
        };
      } else {
        currentEntitySketch = {
          brushes: [],
          properties: {},
        };
      }

      continue;
    }

    if (isClosingBracket(line)) {
      if (currentBrushSketch) {
        if (!currentEntitySketch) {
          throw new UnmarshalException(filename, lineno, "Expected brush to be nested inside entity");
        }

        currentEntitySketch.brushes.push(currentBrushSketch);
        currentBrushSketch = null;
        continue;
      } else if (currentEntitySketch) {
        yield currentEntitySketch;

        currentEntitySketch = null;
        continue;
      }

      throw new UnmarshalException(filename, lineno, "Unexpected closing bracket.");
    }

    if (currentBrushSketch) {
      currentBrushSketch.halfSpaces.push(unmarshalHalfSpace(filename, lineno, line));
      continue;
    }

    if (currentEntitySketch) {
      const property = unmarshalEntityProperty(filename, lineno, line);

      currentEntitySketch.properties[property[0]] = property[1];
      continue;
    }

    throw new UnmarshalException(filename, lineno, "Unexpected line.");
  }

  if (currentBrushSketch) {
    throw new UnmarshalException(filename, 0, "Unexpected end of brush data.");
  }

  if (currentEntitySketch) {
    throw new UnmarshalException(filename, 0, "Unexpected end of entity data.");
  }
}
