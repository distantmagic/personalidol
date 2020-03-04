import CancelToken from "src/framework/classes/CancelToken";
import LoggerBreadcrumbs from "src/framework/classes/LoggerBreadcrumbs";

test("produces abort signal", function() {
  const loggerBreadcrumbs = new LoggerBreadcrumbs();
  const cancelToken = new CancelToken(loggerBreadcrumbs);

  expect(cancelToken.getAbortSignal()).not.toBeNull();
});
