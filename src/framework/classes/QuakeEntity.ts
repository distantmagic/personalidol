import { Vector3 } from "three";

import Exception from "./Exception";
import isArrayEqual from "../helpers/isArrayEqual";
import QuakePointParser from "./QuakePointParser";

import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { QuakeBrush } from "../interfaces/QuakeBrush";
import { QuakeEntity as QuakeEntityInterface } from "../interfaces/QuakeEntity";
import { QuakeEntityProperties } from "../interfaces/QuakeEntityProperties";

export default class QuakeEntity implements QuakeEntityInterface {
  readonly brushes: ReadonlyArray<QuakeBrush>;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;
  readonly props: QuakeEntityProperties;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: QuakeEntityProperties, brushes: ReadonlyArray<QuakeBrush> = []) {
    this.brushes = brushes;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.props = props;
  }

  getBrushes(): ReadonlyArray<QuakeBrush> {
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

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), this.getBrushes(), other.getBrushes());
  }
}
