import Controllable from "src/framework/classes/Controllable";
import ControlToken from "src/framework/classes/ControlToken";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("accepts both internal control token and external token", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const internalControlToken = new ControlToken(loggerBreadcrumbs);
  const controllable = new Controllable(loggerBreadcrumbs, internalControlToken);
});
