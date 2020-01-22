import ControlToken from "src/framework/classes/ControlToken";
import { default as ControlTokenException } from "src/framework/classes/Exception/ControlToken";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IControllable } from "src/framework/interfaces/Controllable";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";

export default class Controllable implements HasLoggerBreadcrumbs, IControllable {
  private controlToken: null | IControlToken = null;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  cedeControlToken(controlToken: IControlToken): void {
    if (!this.isControlledBy(controlToken)) {
      throw new ControlTokenException(this.loggerBreadcrumbs.add("cedeControlToken"), "Object is not controlled by given control token.");
    }

    this.controlToken = null;
  }

  isControlled(): boolean {
    return null !== this.controlToken;
  }

  isControlledBy(controlToken: IControlToken): boolean {
    return this.controlToken === controlToken;
  }

  obtainControlToken(): IControlToken {
    if (this.isControlled()) {
      throw new ControlTokenException(this.loggerBreadcrumbs.add("obtainControlToken"), "Object is already being controlled.");
    }

    const controlToken = new ControlToken();

    this.controlToken = controlToken;

    return controlToken;
  }
}
