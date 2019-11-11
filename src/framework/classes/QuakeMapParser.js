// @flow

import QuakeBrushEntityPropertyParser from "./QuakeBrushEntityPropertyParser";
import QuakeBrushHalfPlaneParser from "./QuakeBrushHalfPlaneParser";
import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrushEntityProperty } from "../interfaces/QuakeBrushEntityProperty";
import type { QuakeBrushHalfPlane } from "../interfaces/QuakeBrushHalfPlane";
import type { QuakeMapParser as QuakeMapParserInterface } from "../interfaces/QuakeMapParser";

const REGEXP_NEWLINE = /\r?\n/;

export default class QuakeMapParser implements QuakeMapParserInterface {
  +content: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, content: string) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  brushHalfPlane(line: string): QuakeBrushHalfPlane {
    return new QuakeBrushHalfPlaneParser(this.loggerBreadcrumbs.add("brushHalfPlane"), line).parse();
  }

  entityProperty(line: string): QuakeBrushEntityProperty {
    return new QuakeBrushEntityPropertyParser(this.loggerBreadcrumbs.add("entityProperty"), line).parse();
  }

  parse(): void {
    const entities = [];
    const lines = this.splitLines(this.content);
    let currentBrush = null;
    let currentEntity: ?{|
      brush: ?$ReadOnlyArray<QuakeBrushHalfPlane>,
      props: Array<QuakeBrushEntityProperty>,
    |} = null;

    for (let lineno = 0; lineno < lines.length; lineno += 1) {
      const line = lines[lineno];
      const breadcrumbs = this.loggerBreadcrumbs.addVariable(String(lineno));

      if (this.isComment(line) || this.isEmpty(line)) {
        continue;
      }

      if (this.isOpeningBracket(line)) {
        if (currentEntity) {
          currentBrush = [];
          continue;
        } else if (!currentEntity) {
          currentEntity = {
            brush: null,
            props: [],
          };
          continue;
        } else {
          throw new QuakeMapParserException(breadcrumbs, "Unexpected opening bracket.");
        }
      }

      if (this.isClosingBracket(line)) {
        if (currentBrush) {
          if (!currentEntity) {
            throw new QuakeMapParserException(breadcrumbs, "Expected brush to be nested inside entity");
          }
          if (currentEntity.brush) {
            throw new QuakeMapParserException(breadcrumbs, "Multiple brushes inside entity.");
          }

          currentEntity.brush = currentBrush;
          currentBrush = null;
          continue;
        } else if (currentEntity) {
          entities.push(currentEntity);
          currentEntity = null;
          continue;
        } else {
          throw new QuakeMapParserException(breadcrumbs, "Unexpected closing bracket.");
        }
      }

      if (currentBrush) {
        currentBrush.push(this.brushHalfPlane(line));
        continue;
      }

      if (currentEntity) {
        currentEntity.props.push(this.entityProperty(line));
        continue;
      }

      throw new QuakeMapParserException(breadcrumbs, "Unexpected line.");
    }

    console.log(entities);
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
