import findControllable from "src/framework/helpers/findControllable";
import findLoggerBreadcrumbs from "src/framework/helpers/findLoggerBreadcrumbs";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as ControlTokenException } from "src/framework/classes/Exception/ControlToken";

import Controllable from "src/framework/interfaces/Controllable";
import ControllableDelegate from "src/framework/interfaces/ControllableDelegate";
import ControlToken from "src/framework/interfaces/ControlToken";

type ControllableTypes = Controllable | ControllableDelegate;

const decoratorBreadcrumbs = new LoggerBreadcrumbs(["controlled", "decorator"]);

export default function controlled(isDelegate: boolean = false) {
  function decorator(target: ControllableTypes, method: string, propertyDescriptor: PropertyDescriptor) {
    const wrappedMethod = propertyDescriptor.value;

    propertyDescriptor.value = function(controlToken: ControlToken, ...args: any[]) {
      // prettier-ignore
      const loggerBreadcrumbs = findLoggerBreadcrumbs(this, decoratorBreadcrumbs).add("controlled").add("decorator").addVariable(method);
      const controllable: Controllable = findControllable(loggerBreadcrumbs.add("findControllable"), isDelegate, this as ControllableTypes);

      if (controllable.isControlledByInternalToken(controlToken) || controllable.isControlledByExternalToken(controlToken)) {
        return wrappedMethod.call(this, controlToken, ...args);
      }

      if (!controllable.isControlledByAnyExternalToken()) {
        throw new ControlTokenException(loggerBreadcrumbs, "Control token was not obtained from this object.");
      }

      throw new ControlTokenException(loggerBreadcrumbs, "Invalid control token.");
    };

    return propertyDescriptor;
  }

  return decorator;
}
