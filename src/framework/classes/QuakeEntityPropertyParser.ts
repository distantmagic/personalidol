import QuakeEntityProperty from "src/framework/classes/QuakeEntityProperty";
import { default as QuakeMapParserException } from "src/framework/classes/Exception/QuakeMap/Parser";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IQuakeEntityProperty } from "src/framework/interfaces/QuakeEntityProperty";
import { default as IQuakeEntityPropertyParser } from "src/framework/interfaces/QuakeEntityPropertyParser";

export default class QuakeEntityPropertyParser implements HasLoggerBreadcrumbs, IQuakeEntityPropertyParser {
  readonly line: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, line: string) {
    this.line = line;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  entityPropertySplits(splits: ReadonlyArray<string>): IQuakeEntityProperty {
    if (splits.length !== 5) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("entityPropertySplits"), "Unexpected number of brush splits.");
    }

    return new QuakeEntityProperty(this.loggerBreadcrumbs.add("entityPropertySplits"), splits[1], splits[3]);
  }

  parse(): IQuakeEntityProperty {
    const splits = this.line.split('"');

    if (splits.length < 5) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Expected entity property.");
    }

    if (splits.length === 5) {
      return this.entityPropertySplits(splits);
    }

    // might contain backslashes to escape strings inside properties
    const reduced = splits.reduceRight(function(acc: string[], curr: string) {
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
