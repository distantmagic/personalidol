import { default as ControlTokenException } from "src/framework/classes/Exception/ControlToken";

import type Controllable from "src/framework/interfaces/Controllable";
import type ControllableDelegate from "src/framework/interfaces/ControllableDelegate";
import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

type ControllableTypes = Controllable | ControllableDelegate;

export default function findControllable(loggerBreadcrumbs: LoggerBreadcrumbs, isDelegate: boolean, object: ControllableTypes): Controllable {
  if (!isDelegate) {
    return object as Controllable;
  }

  const getControllable = (object as ControllableDelegate).getControllable;

  if ("function" === typeof getControllable) {
    return getControllable.call(object);
  }

  throw new ControlTokenException(loggerBreadcrumbs, "Could not determine Controllable object.");
}
