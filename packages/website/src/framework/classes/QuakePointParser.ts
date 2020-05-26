import * as THREE from "three";
import filter from "lodash/filter";

import QuakePointPartsParser from "src/framework/classes/QuakePointPartsParser";
import { default as QuakeMapParserException } from "src/framework/classes/Exception/QuakeMap/Parser";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IQuakePointParser } from "src/framework/interfaces/QuakePointParser";

const REGEXP_WHITESPACE = /\s+/;

export default class QuakePointParser implements HasLoggerBreadcrumbs, IQuakePointParser {
  readonly content: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, content: string) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  parse(): THREE.Vector3 {
    const breadcrumbs = this.loggerBreadcrumbs.add("parse");
    const parts = filter(this.content.split(REGEXP_WHITESPACE));

    if (parts.length !== 3) {
      throw new QuakeMapParserException(breadcrumbs, "Point must be defined by three numbers.");
    }

    const pointParts = new QuakePointPartsParser(breadcrumbs.add("QuakePointPartsParser"), parts[0], parts[1], parts[2]);

    return pointParts.parse();
  }
}
