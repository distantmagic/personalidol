import ControlToken from "src/framework/classes/ControlToken";
import { default as ControlTokenException } from "src/framework/classes/Exception/ControlToken";

import HasLoggerBreadcrumbs from "src/framework/interfaces/HasLoggerBreadcrumbs";
import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";
import { default as IControllable } from "src/framework/interfaces/Controllable";
import { default as IControlToken } from "src/framework/interfaces/ControlToken";

export default class Controllable implements HasLoggerBreadcrumbs, IControllable {
  private controlToken: null | IControlToken = null;
  readonly internalControlToken: IControlToken;
  readonly loggerBreadcrumbs: LoggerBreadcrumbs;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, internalControlToken: IControlToken = new ControlToken(loggerBreadcrumbs)) {
    this.internalControlToken = internalControlToken;
    this.loggerBreadcrumbs = loggerBreadcrumbs;
  }

  cedeExternalControlToken(controlToken: IControlToken): void {
    if (!this.isControlledByExternalToken(controlToken)) {
      throw new ControlTokenException(this.loggerBreadcrumbs.add("cedeExternalControlToken"), "Object is not controlled by given control token.");
    }

    this.controlToken = null;
  }

  isControlledByExternalToken(controlToken: IControlToken): boolean {
    return this.controlToken === controlToken;
  }

  isControlledByAnyExternalToken(): boolean {
    return null !== this.controlToken;
  }

  isControlledByInternalToken(controlToken: IControlToken): boolean {
    return this.internalControlToken === controlToken;
  }

  obtainControlToken(): IControlToken {
    const breadcrumbs = this.loggerBreadcrumbs.add("obtainControlToken");

    if (this.isControlledByAnyExternalToken()) {
      throw new ControlTokenException(breadcrumbs, "Object is already being controlled.");
    }

    const controlToken = new ControlToken(breadcrumbs);

    this.controlToken = controlToken;

    return controlToken;
  }
}
