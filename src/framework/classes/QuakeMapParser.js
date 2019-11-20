// @flow

import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfSpaceParser from "./QuakeBrushHalfSpaceParser";
import QuakeEntity from "./QuakeEntity";
import QuakeEntityProperties from "./QuakeEntityProperties";
import QuakeEntityPropertyParser from "./QuakeEntityPropertyParser";
import QuakeMap from "./QuakeMap";
import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfSpace } from "../interfaces/QuakeBrushHalfSpace";
import type { QuakeEntity as QuakeEntityInterface } from "../interfaces/QuakeEntity";
import type { QuakeEntityProperty } from "../interfaces/QuakeEntityProperty";
import type { QuakeMap as QuakeMapInterface } from "../interfaces/QuakeMap";
import type { QuakeMapParser as QuakeMapParserInterface } from "../interfaces/QuakeMapParser";

const REGEXP_NEWLINE = /\r?\n/;

export default class QuakeMapParser implements QuakeMapParserInterface {
  +content: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

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

  parse(): QuakeMapInterface {
    const entities: QuakeEntityInterface[] = [];
    const lines: $ReadOnlyArray<string> = this.splitLines(this.content);
    let currentBrushSketch: ?(QuakeBrushHalfSpace[]) = null;
    let currentEntitySketch: ?{|
      brushes: QuakeBrushInterface[],
      props: QuakeEntityProperty[],
    |} = null;

    for (let lineno = 0; lineno < lines.length; lineno += 1) {
      const line = lines[lineno];
      const breadcrumbs = this.loggerBreadcrumbs.addVariable(String(lineno + 1));

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
          const quakeEntity = new QuakeEntity(breadcrumbs.add("QuakeEntity"), quakeEntityProperties, currentEntitySketch.brushes);

          entities.push(quakeEntity);
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

    return new QuakeMap(this.loggerBreadcrumbs.add("QuakeMap"), entities);
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

  splitLines(content: string): $ReadOnlyArray<string> {
    return content.split(REGEXP_NEWLINE).map(line => line.trim());
  }
}
