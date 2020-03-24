import findLoggerBreadcrumbs from "src/framework/helpers/findLoggerBreadcrumbs";

import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";
import { default as CancelTokenException } from "src/framework/classes/Exception/CancelToken";

import type CancelToken from "src/framework/interfaces/CancelToken";

const decoratorBreadcrumbs = new LoggerBreadcrumbs(["cancelable", "decorator"]);

export default function cancelable(throws: boolean = false) {
  function decorator(target: Object, method: string, propertyDescriptor: PropertyDescriptor) {
    const wrappedMethod = propertyDescriptor.value;

    propertyDescriptor.value = function (cancelToken: CancelToken, ...args: any[]): void {
      if (!cancelToken.isCanceled()) {
        return wrappedMethod.call(this, cancelToken, ...args);
      }

      if (!throws) {
        return;
      }

      // prettier-ignore
      throw new CancelTokenException(
        findLoggerBreadcrumbs(this, decoratorBreadcrumbs).add("cancelable").add("decorator").addVariable(method),
        `Cancel token was already canceled.`
      );
    };

    return propertyDescriptor;
  }

  return decorator;
}
