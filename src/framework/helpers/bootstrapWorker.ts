/// <reference lib="webworker" />

import bootstrapFramework from "src/framework/helpers/bootstrapFramework";
import BusClock from "src/framework/classes/BusClock";
import CancelToken from "src/framework/classes/CancelToken";
import JSONRPCServer from "src/framework/classes/JSONRPCServer";
import { default as ConsoleLogger } from "src/framework/classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "src/framework/classes/ExceptionHandlerFilter/Unexpected";

import { CancelToken as CancelTokenInterface } from "src/framework/interfaces/CancelToken";
import { ClockReactiveController } from "src/framework/interfaces/ClockReactiveController";
import { Debugger } from "src/framework/interfaces/Debugger";
import { ExceptionHandler } from "src/framework/interfaces/ExceptionHandler";
import { JSONRPCServer as JSONRPCServerInterface } from "src/framework/interfaces/JSONRPCServer";
import { Logger } from "src/framework/interfaces/Logger";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";
import { QueryBus } from "src/framework/interfaces/QueryBus";

// prettier-ignore
type BootstrapWorkerCallback = (
  cancelTokenInterface: CancelTokenInterface,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  jsonRPCServerInterface: JSONRPCServerInterface,
  queryBus: QueryBus,
) => void;

export default function bootstrapWorker(bootstrapper: BootstrapWorkerCallback): DedicatedWorkerGlobalScope["onmessage"] {
  return bootstrapFramework(function(
    clockReactiveController: ClockReactiveController,
    debug: Debugger,
    exceptionHandler: ExceptionHandler,
    logger: Logger,
    loggerBreadcrumbs: LoggerBreadcrumbs,
    queryBus: QueryBus
  ) {
    const cancelToken = new CancelToken(loggerBreadcrumbs);
    const jsonRpcServer = new JSONRPCServer(loggerBreadcrumbs, self.postMessage.bind(self));

    bootstrapper(cancelToken, loggerBreadcrumbs, jsonRpcServer, queryBus);
    clockReactiveController.interval(cancelToken);

    return jsonRpcServer.useMessageHandler(cancelToken);
  });
}
