import * as THREE from "three";

import { default as QuakeMapParserException } from "src/framework/classes/Exception/QuakeMap/Parser";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IQuakePointParser } from "src/framework/interfaces/QuakePointParser";

/**
 * This class exists to provide consistency. Although it may seem redundant at
 * first glance, in reality one place that eventually parses every occurrence
 * of map coordinates is really useful.
 */
export default class QuakePointPartsParser implements HasLoggerBreadcrumbs, IQuakePointParser {
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly x: string;
  readonly y: string;
  readonly z: string;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, x: string, y: string, z: string) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.x = x;
    this.y = y;
    this.z = z;
  }

  parse(): THREE.Vector3 {
    const x = Number(this.x);
    const y = Number(this.y);
    const z = Number(this.z);

    if (isNaN(x) || isNaN(y) || isNaN(y)) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Point consists of invalid numbers.");
    }

    // .map files use different coordinates system than THREE
    // XYZ -> YZX
    return new THREE.Vector3(y, z, x);
  }
}
