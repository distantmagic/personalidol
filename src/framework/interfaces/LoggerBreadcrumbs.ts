import Arrayable from "src/framework/interfaces/Arrayable";
import Equatable from "src/framework/interfaces/Equatable";
import Stringable from "src/framework/interfaces/Stringable";

export default interface LoggerBreadcrumbs extends Arrayable<string>, Equatable<LoggerBreadcrumbs>, Stringable {
  add(breadcrumb: string): LoggerBreadcrumbs;

  addVariable(breadcrumb: string): LoggerBreadcrumbs;

  getBreadcrumbs(): ReadonlyArray<string>;
}
