// @flow

import QuakeBrush from "./QuakeBrush";
import QuakeBrushHalfPlaneParser from "./QuakeBrushHalfPlaneParser";
import QuakeEntity from "./QuakeEntity";
import QuakeEntityProperties from "./QuakeEntityProperties";
import QuakeEntityPropertyParser from "./QuakeEntityPropertyParser";
import QuakeMap from "./QuakeMap";
import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush as QuakeBrushInterface } from "../interfaces/QuakeBrush";
import type { QuakeBrushHalfPlane } from "../interfaces/QuakeBrushHalfPlane";
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

  brushHalfPlane(line: string): QuakeBrushHalfPlane {
    return new QuakeBrushHalfPlaneParser(this.loggerBreadcrumbs.add("brushHalfPlane"), line).parse();
  }

  entityProperty(line: string): QuakeEntityProperty {
    return new QuakeEntityPropertyParser(this.loggerBreadcrumbs.add("entityProperty"), line).parse();
  }

  parse(): QuakeMapInterface {
    const entities: Array<QuakeEntityInterface> = [];
    const lines: $ReadOnlyArray<string> = this.splitLines(this.content);
    let currentBrushSketch: ?Array<QuakeBrushHalfPlane> = null;
    let currentEntitySketch: ?{|
      brush: ?QuakeBrushInterface,
      props: Array<QuakeEntityProperty>,
    |} = null;

    for (let lineno = 0; lineno < lines.length; lineno += 1) {
      const line = lines[lineno];
      const breadcrumbs = this.loggerBreadcrumbs.addVariable(String(lineno));

      if (this.isComment(line) || this.isEmpty(line)) {
        continue;
      }

      if (this.isOpeningBracket(line)) {
        if (currentEntitySketch) {
          currentBrushSketch = [];
          continue;
        } else if (!currentEntitySketch) {
          currentEntitySketch = {
            brush: null,
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
          if (currentEntitySketch.brush) {
            throw new QuakeMapParserException(breadcrumbs, "Multiple brushes inside entity.");
          }

          currentEntitySketch.brush = new QuakeBrush(breadcrumbs.add("QuakeBrush"), currentBrushSketch);
          currentBrushSketch = null;
          continue;
        } else if (currentEntitySketch) {
          const quakeEntityProperties = new QuakeEntityProperties(
            breadcrumbs.add("QuakeEntityProperties"),
            currentEntitySketch.props
          );
          const quakeEntity = new QuakeEntity(
            breadcrumbs.add("QuakeEntity"),
            quakeEntityProperties,
            currentEntitySketch.brush
          );

          entities.push(quakeEntity);
          currentEntitySketch = null;
          continue;
        } else {
          throw new QuakeMapParserException(breadcrumbs, "Unexpected closing bracket.");
        }
      }

      if (currentBrushSketch) {
        currentBrushSketch.push(this.brushHalfPlane(line));
        continue;
      }

      if (currentEntitySketch) {
        currentEntitySketch.props.push(this.entityProperty(line));
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
