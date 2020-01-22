import QuakeBrush from "src/framework/classes/QuakeBrush";
import QuakeBrushHalfSpaceParser from "src/framework/classes/QuakeBrushHalfSpaceParser";
import QuakeEntity from "src/framework/classes/QuakeEntity";
import QuakeEntityProperties from "src/framework/classes/QuakeEntityProperties";
import QuakeEntityPropertyParser from "src/framework/classes/QuakeEntityPropertyParser";
import { default as QuakeMapParserException } from "src/framework/classes/Exception/QuakeMap/Parser";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QuakeBrushHalfSpace from "src/framework/interfaces/QuakeBrushHalfSpace";
import QuakeEntityProperty from "src/framework/interfaces/QuakeEntityProperty";
import { default as IQuakeBrush } from "src/framework/interfaces/QuakeBrush";
import { default as IQuakeEntity } from "src/framework/interfaces/QuakeEntity";
import { default as IQuakeMapParser } from "src/framework/interfaces/QuakeMapParser";

const REGEXP_NEWLINE = /\r?\n/;

export default class QuakeMapParser implements HasLoggerBreadcrumbs, IQuakeMapParser {
  readonly content: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, content: string) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  brushHalfSpace(breadcrumbs: LoggerBreadcrumbs, line: string): QuakeBrushHalfSpace {
    return new QuakeBrushHalfSpaceParser(breadcrumbs.add("brushHalfSpace"), line).parse();
  }

  entityProperty(breadcrumbs: LoggerBreadcrumbs, line: string): QuakeEntityProperty {
    return new QuakeEntityPropertyParser(breadcrumbs.add("entityProperty"), line).parse();
  }

  *parse(): Generator<IQuakeEntity> {
    const loggerBreadcrumbs = this.loggerBreadcrumbs.add("parse");
    const lines: ReadonlyArray<string> = this.splitLines(this.content);
    let currentBrushSketch: null | QuakeBrushHalfSpace[] = null;
    let currentEntitySketch: null | {
      brushes: IQuakeBrush[];
      props: QuakeEntityProperty[];
    } = null;

    for (let lineno = 0; lineno < lines.length; lineno += 1) {
      const line = lines[lineno];
      const breadcrumbs = loggerBreadcrumbs.addVariable(String(lineno + 1));

      if (this.isComment(line) || this.isEmpty(line)) {
        continue;
      }

      if (this.isOpeningBracket(line)) {
        if (currentEntitySketch) {
          currentBrushSketch = [];
          continue;
        } else if (!currentEntitySketch) {
          currentEntitySketch = {
            brushes: [],
            props: [],
          };
          continue;
        } else {
          throw new QuakeMapParserException(breadcrumbs, "Unexpected opening bracket.");
        }
      }

      if (this.isClosingBracket(line)) {
        if (currentBrushSketch) {
          if (!currentEntitySketch) {
            throw new QuakeMapParserException(breadcrumbs, "Expected brush to be nested inside entity");
          }
          currentEntitySketch.brushes.push(new QuakeBrush(breadcrumbs.add("QuakeBrush"), currentBrushSketch));
          currentBrushSketch = null;
          continue;
        } else if (currentEntitySketch) {
          const quakeEntityProperties = new QuakeEntityProperties(breadcrumbs.add("QuakeEntityProperties"), currentEntitySketch.props);

          yield new QuakeEntity(breadcrumbs.add("QuakeEntity"), quakeEntityProperties, currentEntitySketch.brushes);

          currentEntitySketch = null;
          continue;
        } else {
          throw new QuakeMapParserException(breadcrumbs, "Unexpected closing bracket.");
        }
      }

      if (currentBrushSketch) {
        currentBrushSketch.push(this.brushHalfSpace(breadcrumbs, line));
        continue;
      }

      if (currentEntitySketch) {
        currentEntitySketch.props.push(this.entityProperty(breadcrumbs, line));
        continue;
      }

      throw new QuakeMapParserException(breadcrumbs, "Unexpected line.");
    }

    if (currentBrushSketch) {
      throw new QuakeMapParserException(loggerBreadcrumbs, "Unexpected end of brush data.");
    }

    if (currentEntitySketch) {
      throw new QuakeMapParserException(loggerBreadcrumbs, "Unexpected end of entity data.");
    }
  }

  isClosingBracket(line: string): boolean {
    return line.startsWith("}");
  }

  isComment(line: string): boolean {
    return line.startsWith("//");
  }

  isEmpty(line: string): boolean {
    return line.trim().length < 1;
  }

  isOpeningBracket(line: string): boolean {
    return line.startsWith("{");
  }

  splitLines(content: string): ReadonlyArray<string> {
    return content.split(REGEXP_NEWLINE).map(line => line.trim());
  }
}
