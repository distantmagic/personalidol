// @flow

import * as THREE from "three";

import QuakeBrushEntityProperty from "./QuakeBrushEntityProperty";
import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrushEntityProperty as QuakeBrushEntityPropertyInterface } from "../interfaces/QuakeBrushEntityProperty";
import type { QuakeBrushEntityPropertyParser as QuakeBrushEntityPropertyParserInterface } from "../interfaces/QuakeBrushEntityPropertyParser";

export default class QuakeBrushEntityPropertyParser implements QuakeBrushEntityPropertyParserInterface {
  +line: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, line: string) {
    this.line = line;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  entityPropertySplits(splits: $ReadOnlyArray<string>): QuakeBrushEntityPropertyInterface {
    if (splits.length !== 5) {
      throw new QuakeMapParserException(
        this.loggerBreadcrumbs.add("entityPropertySplits"),
        "Unexpected number of brush splits."
      );
    }

    return new QuakeBrushEntityProperty(splits[1], splits[3]);
  }

  parse(): QuakeBrushEntityPropertyInterface {
    const splits = this.line.split('"');

    if (splits.length < 5) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Expected entity property.");
    }

    if (splits.length === 5) {
      return this.entityPropertySplits(splits);
    }

    // might contain backslashes to escape strings inside properties
    const reduced = splits.reduceRight(function(acc, curr) {
      if (curr.endsWith("\\")) {
        const last = acc.shift();

        acc.unshift(curr.substr(0, curr.length - 1) + '"' + last);
      } else {
        acc.unshift(curr);
      }

      return acc;
    }, []);

    if (reduced.length !== 5) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Expected entity property.");
    }

    return this.entityPropertySplits(reduced);
  }
}
