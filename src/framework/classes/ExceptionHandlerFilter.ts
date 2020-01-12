import { ExceptionHandlerFilter as ExceptionHandlerFilterInterface } from "src/framework/interfaces/ExceptionHandlerFilter";

export default class ExceptionHandlerFilter implements ExceptionHandlerFilterInterface {
  isCapturable(error: Error): boolean {
    return true;
  }
}
