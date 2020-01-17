import isArrayEqual from "src/framework/helpers/isArrayEqual";

import Exception from "src/framework/classes/Exception";
import QuakePointParser from "src/framework/classes/QuakePointParser";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QuakeBrush from "src/framework/interfaces/QuakeBrush";
import QuakeEntityProperties from "src/framework/interfaces/QuakeEntityProperties";
import { default as IQuakeEntity } from "src/framework/interfaces/QuakeEntity";

export default class QuakeEntity implements IQuakeEntity {
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

  getOrigin(): THREE.Vector3 {
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

  isEqual(other: IQuakeEntity): boolean {
    if (!this.getProperties().isEqual(other.getProperties())) {
      return false;
    }

    return isArrayEqual(this.loggerBreadcrumbs.add("isEqual"), this.getBrushes(), other.getBrushes());
  }
}
