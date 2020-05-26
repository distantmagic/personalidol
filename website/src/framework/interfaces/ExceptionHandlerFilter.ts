export default interface ExceptionHandlerFilter {
  isCapturable(error: Error): boolean;
}
