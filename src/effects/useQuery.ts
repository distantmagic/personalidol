import * as React from "react";

import CancelToken from "src/framework/classes/CancelToken";

import { CancelTokenQuery } from "src/framework/interfaces/CancelTokenQuery";
import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { Query } from "src/framework/interfaces/Query";
import { QueryBus } from "src/framework/interfaces/QueryBus";

export default function useQuery<T>(
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  queryBus: QueryBus,
  query: null | Query<T>
): null | CancelTokenQuery<T> {
  const [cancelTokenQuery, setCancelTokenQuery] = React.useState<null | CancelTokenQuery<T>>(null);
  const setIsExecuted = React.useState<boolean>(false)[1];

  React.useEffect(
    function() {
      if (!query) {
        return;
      }

      const breadcrumbs = loggerBreadcrumbs.add("React.useEffect");
      const cancelToken = new CancelToken(breadcrumbs);
      const cancelTokenQuery = queryBus.enqueue(cancelToken, query);

      setIsExecuted(false);
      setCancelTokenQuery(cancelTokenQuery);

      cancelTokenQuery
        .whenExecuted()
        .then(function() {
          return setIsExecuted(true);
        })
        .catch(async function(err) {
          const isCaptured = await exceptionHandler.captureException(breadcrumbs, err);

          if (isCaptured) {
            throw err;
          }
        });

      return function() {
        cancelToken.cancel(breadcrumbs.add("cleanup"));
      };
    },
    [exceptionHandler, loggerBreadcrumbs, query, queryBus, setIsExecuted]
  );

  return cancelTokenQuery;
}
