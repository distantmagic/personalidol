// @flow

import * as equality from "../helpers/equality";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QuakeEntityProperty } from "../interfaces/QuakeEntityProperty";
import type { QuakeEntityProperties as QuakeEntityPropertiesInterface } from "../interfaces/QuakeEntityProperties";

export default class QuakeEntityProperties implements QuakeEntityPropertiesInterface {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +props: $ReadOnlyArray<QuakeEntityProperty>;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, props: $ReadOnlyArray<QuakeEntityProperty>) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.props = props;
  }

  getProperties(): $ReadOnlyArray<QuakeEntityProperty> {
    return this.props;
  }

  isEqual(other: QuakeEntityPropertiesInterface): boolean {
    const thisProps = this.getProperties();
    const otherProps = other.getProperties();

    return equality.isArrayEqual(thisProps, otherProps);
  }
}
