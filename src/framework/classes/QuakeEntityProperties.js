// @flow

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
}
