// @flow

import * as THREE from "three";

import QuakeBrushHalfPlane from "./QuakeBrushHalfPlane";
import { default as QuakeMapParserException } from "./Exception/QuakeMap/Parser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrushHalfPlane as QuakeBrushHalfPlaneInterface } from "../interfaces/QuakeBrushHalfPlane";
import type { QuakeBrushHalfPlaneParser as QuakeBrushHalfPlaneParserInterface } from "../interfaces/QuakeBrushHalfPlaneParser";

const REGEXP_BRUSH_HALFPLANE = /^\s*\(\s*(\-?[0-9]+)\s+(\-?[0-9]+)\s+(\-?[0-9]+)\s*\)\s*\(\s*(\-?[0-9]+)\s+(\-?[0-9]+)\s+(\-?[0-9]+)\s*\)\s*\(\s*(\-?[0-9]+)\s+(\-?[0-9]+)\s+(\-?[0-9]+)\s*\)\s+([_a-zA-Z]+)\s+(\-?[0-9]+)\s+(\-?[0-9]+)\s+(\-?[\.0-9]+)\s+(\-?[0-9]+)\s+(\-?[0-9]+)$/;

export default class QuakeBrushHalfPlaneParser implements QuakeBrushHalfPlaneParserInterface {
  +line: string;
  +loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, line: string) {
    this.line = line;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  parse(): QuakeBrushHalfPlaneInterface {
    const match = this.line.match(REGEXP_BRUSH_HALFPLANE);

    if (!match) {
      throw new QuakeMapParserException(this.loggerBreadcrumbs.add("parse"), "Expected brush half-plane.");
    }

    const textureRotationAngle = Number(match[13]);

    if (isNaN(textureRotationAngle)) {
      throw new QuakeMapParserException(
        this.loggerBreadcrumbs.add("parse"),
        "Brush half-plane's texture rotation angle is not a number."
      );
    }

    return new QuakeBrushHalfPlane(
      new THREE.Vector3(Number(match[1]), Number(match[2]), Number(match[3])),
      new THREE.Vector3(Number(match[4]), Number(match[5]), Number(match[6])),
      new THREE.Vector3(Number(match[7]), Number(match[8]), Number(match[9])),
      // texture
      String(match[10]),
      // Texture x-offset (must be multiple of 16)
      Number(match[11]),
      // Texture y-offset (must be multiple of 16)
      Number(match[12]),
      // floating point value indicating texture rotation
      Number(textureRotationAngle),
      // scales x-dimension of texture (negative value to flip)
      Number(match[14]),
      // scales y-dimension of texture (negative value to flip)
      Number(match[15])
    );
  }
}
