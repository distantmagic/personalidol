import ExceptionHandlerFilter from "src/framework/classes/ExceptionHandlerFilter";
import { default as CanceledException } from "src/framework/classes/Exception/CancelToken/Canceled";

export default class Unexpected extends ExceptionHandlerFilter {
  isCapturable(error: Error): boolean {
    return super.isCapturable(error) && !(error instanceof CanceledException);
  }
}
