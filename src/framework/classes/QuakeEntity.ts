import isArrayEqual from "src/framework/helpers/isArrayEqual";

import Exception from "src/framework/classes/Exception";
import QuakePointParser from "src/framework/classes/QuakePointParser";

import QuakeEntityClassName from "src/framework/enums/QuakeEntityClassName";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import QuakeBrush from "src/framework/interfaces/QuakeBrush";
import QuakeEntityProperties from "src/framework/interfaces/QuakeEntityProperties";
import { default as IQuakeEntity } from "src/framework/interfaces/QuakeEntity";

import QuakeEntityType from "src/framework/types/QuakeEntityType";

export default class QuakeEntity implements HasLoggerBreadcrumbs, IQuakeEntity {
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

  getClassName(): QuakeEntityClassName {
    const className = this.props.getPropertyByKey("classname").getValue();

    switch (className) {
      case QuakeEntityClassName.FuncGroup:
      case QuakeEntityClassName.LightPoint:
      case QuakeEntityClassName.LightSpotLight:
      case QuakeEntityClassName.ModelGLTF:
      case QuakeEntityClassName.ModelMD2:
      case QuakeEntityClassName.Player:
      case QuakeEntityClassName.SparkParticles:
      case QuakeEntityClassName.WorldSpawn:
        return className;
      default:
        throw new Exception(this.loggerBreadcrumbs.add("getClassName"), `Unexpected entity class name: "${className}"`);
    }
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

  getType(): QuakeEntityType {
    if (!this.props.hasPropertyKey("_tb_type")) {
      return null;
    }

    const type = this.props.getPropertyByKey("_tb_type").getValue();

    switch (type) {
      case "_tb_group":
      case "_tb_layer":
        return type;
      default:
        throw new Exception(this.loggerBreadcrumbs.add("getType"), `Unexpected entity type: "${type}"`);
    }
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
