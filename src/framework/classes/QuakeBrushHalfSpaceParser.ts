import QuakeBrushHalfSpace from "src/framework/classes/QuakeBrushHalfSpace";
import QuakePointPartsParser from "src/framework/classes/QuakePointPartsParser";
import { default as QuakeMapParserException } from "src/framework/classes/Exception/QuakeMap/Parser";

import type HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import type { default as IQuakeBrushHalfSpace } from "src/framework/interfaces/QuakeBrushHalfSpace";
import type { default as IQuakeBrushHalfSpaceParser } from "src/framework/interfaces/QuakeBrushHalfSpaceParser";

const REGEXP_WHITESPACE = /\s+/;

export default class QuakeBrushHalfSpaceParser implements HasLoggerBreadcrumbs, IQuakeBrushHalfSpaceParser {
  readonly line: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, line: string) {
    this.line = line;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  parse(): IQuakeBrushHalfSpace {
    const parts = this.line.trim().split(REGEXP_WHITESPACE);

    if (parts.length !== 21) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Brush half-plane is in incorrect format.");
    }

    if (parts[0] !== parts[5] || parts[5] !== parts[10] || parts[0] !== "(") {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Expected '(', got something else.");
    }

    if (parts[4] !== parts[9] || parts[9] !== parts[14] || parts[4] !== ")") {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Expected ')', got something else.");
    }

    const parserBreadcrumbs = this.loggerBreadcrumbs.add("QuakePointPartsParser");

    const v1Parser = new QuakePointPartsParser(parserBreadcrumbs.add("v1"), parts[1], parts[2], parts[3]);
    const v2Parser = new QuakePointPartsParser(parserBreadcrumbs.add("v2"), parts[6], parts[7], parts[8]);
    const v3Parser = new QuakePointPartsParser(parserBreadcrumbs.add("v3"), parts[11], parts[12], parts[13]);

    return new QuakeBrushHalfSpace(
      v1Parser.parse(),
      v2Parser.parse(),
      v3Parser.parse(),
      // texture
      String(parts[15]),
      // Texture x-offset (must be multiple of 16)
      Number(parts[16]),
      // Texture y-offset (must be multiple of 16)
      Number(parts[17]),
      // floating point value indicating texture rotation
      Number(parts[18]),
      // scales x-dimension of texture (negative value to flip)
      Number(parts[19]),
      // scales y-dimension of texture (negative value to flip)
      Number(parts[20])
    );
  }
}
