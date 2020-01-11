export interface ExceptionHandlerFilter {
  isCapturable(error: Error): boolean;
}
