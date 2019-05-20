// @flow

import TiledCustomPropertiesException from "./Exception/Tiled/CustomProperties";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { TiledCustomProperty as TiledCustomPropertyInterface } from "../interfaces/TiledCustomProperty";
import type { TiledCustomPropertySerializedObject } from "../types/TiledCustomPropertySerializedObject";
import type { TiledCustomPropertyType } from "../types/TiledCustomPropertyType";

export default class TiledCustomProperty
  implements TiledCustomPropertyInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +name: string;
  +type: TiledCustomPropertyType;
  +value: string;

  constructor(
    loggerBreadcrumbs: LoggerBreadcrumbs,
    name: string,
    type: TiledCustomPropertyType,
    value: string
  ): void {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.name = name;
    this.type = type;
    this.value = value;
  }

  asJson(): string {
    return JSON.stringify(this.asObject());
  }

  asObject(): TiledCustomPropertySerializedObject {
    return {
      name: this.getName(),
      type: this.getType(),
      value: this.getValue()
    };
  }

  getName(): string {
    return this.name;
  }

  getType(): TiledCustomPropertyType {
    return this.type;
  }

  getValue(): string {
    return this.value;
  }

  isEqual(other: TiledCustomPropertyInterface): boolean {
    return (
      this.getName() === other.getName() &&
      this.getType() === other.getType() &&
      this.getValue() === other.getValue()
    );
  }

  isTruthy(): boolean {
    const type = this.getType();

    switch (type) {
      case "bool":
        return "true" === this.getValue();
      default:
        throw new TiledCustomPropertiesException(
          this.loggerBreadcrumbs.add("isTruthy"),
          `Type is not implemented yet: "${type}"`
        );
    }
  }
}
