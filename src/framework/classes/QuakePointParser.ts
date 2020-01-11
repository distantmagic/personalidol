import * as THREE from "three";
import filter from "lodash/filter";

import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import { Vector3 } from "three";

import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { QuakePointParser as QuakePointParserInterface } from "../interfaces/QuakePointParser";

const REGEXP_WHITESPACE = /\s+/;

export default class QuakePointParser implements QuakePointParserInterface {
  readonly content: string;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, content: string) {
    this.content = content;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  parse(): Vector3 {
    const parts = filter(this.content.split(REGEXP_WHITESPACE));

    if (parts.length !== 3) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Point must be defined by three numbers.");
    }

    const x = Number(parts[0]);
    const y = Number(parts[1]);
    const z = Number(parts[2]);

    if (isNaN(x) || isNaN(y) || isNaN(y)) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Point consists of invalid numbers.");
    }

    return new THREE.Vector3(x, y, z);
  }
}
