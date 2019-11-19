// @flow

import QuakeEntityProperty from "./QuakeEntityProperty";
import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeEntityProperty as QuakeEntityPropertyInterface } from "../interfaces/QuakeEntityProperty";
import type { QuakeEntityPropertyParser as QuakeEntityPropertyParserInterface } from "../interfaces/QuakeEntityPropertyParser";

export default class QuakeEntityPropertyParser implements QuakeEntityPropertyParserInterface {
  +line: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, line: string) {
    this.line = line;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  entityPropertySplits(splits: $ReadOnlyArray<string>): QuakeEntityPropertyInterface {
    if (splits.length !== 5) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("entityPropertySplits"), "Unexpected number of brush splits.");
    }

    return new QuakeEntityProperty(splits[1], splits[3]);
  }

  parse(): QuakeEntityPropertyInterface {
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
