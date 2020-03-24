import type { default as IExceptionHandlerFilter } from "src/framework/interfaces/ExceptionHandlerFilter";

export default class ExceptionHandlerFilter implements IExceptionHandlerFilter {
  isCapturable(error: Error): boolean {
    return true;
  }
}
