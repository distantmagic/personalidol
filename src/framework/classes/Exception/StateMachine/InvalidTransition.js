// @flow

import StateMachine from "../StateMachine";

import type { LoggerBreadcrumbs } from "../../../interfaces/LoggerBreadcrumbs";

export default class InvalidTransition extends StateMachine {
  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, transition: string, from: string, to: string) {
    super(loggerBreadcrumbs, `Invalid transition "${transition}" from "${from}" to "${to}".`);
  }
}
