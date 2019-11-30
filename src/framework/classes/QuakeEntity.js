// @flow

import * as equality from "../helpers/equality";
import Exception from "./Exception";
import QuakePointParser from "./QuakePointParser";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeBrush } from "../interfaces/QuakeBrush";
import type { QuakeEntity as QuakeEntityInterface } from "../interfaces/QuakeEntity";
import type { QuakeEntityProperties } from "../interfaces/QuakeEntityProperties";

export default class QuakeEntity implements QuakeEntityInterface {
  +brushes: $ReadOnlyArray<QuakeBrush>;
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +props: QuakeEntityProperties;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: QuakeEntityProperties, brushes: $ReadOnlyArray<QuakeBrush> = []) {
    this.brushes = brushes;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.props = props;
  }

  getBrushes(): $ReadOnlyArray<QuakeBrush> {
    return this.brushes;
  }

  getClassName(): string {
    return this.props.getPropertyByKey("classname").getValue();
  }

  getOrigin(): Vector3 {
    const breadcrumbs = this.loggerBreadcrumbs.add("getOrigin");
    const origin = this.props.getPropertyByKey("origin");

    if (!this.hasOrigin() || !origin) {
      throw new Exception(breadcrumbs, "Entity does not have origin point, but it was expected.");
    }

    const parser = new QuakePointParser(breadcrumbs.add("QuakePointParser"), origin.getValue());

    return parser.parse();
  }

  getProperties(): QuakeEntityProperties {
    return this.props;
  }

  hasOrigin(): boolean {
    return this.props.hasPropertyKey("origin");
  }

  isOfClass(className: string): boolean {
    return this.getClassName() === className;
  }

  isEqual(other: QuakeEntityInterface): boolean {
    if (!this.getProperties().isEqual(other.getProperties())) {
      return false;
    }

    return equality.isArrayEqual(this.getBrushes(), other.getBrushes());
  }
}
