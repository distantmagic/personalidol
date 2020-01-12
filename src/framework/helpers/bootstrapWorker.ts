/// <reference lib="webworker" />

import bootstrapFramework from "./bootstrapFramework";
import BusClock from "../classes/BusClock";
import CancelToken from "../classes/CancelToken";
import JSONRPCServer from "../classes/JSONRPCServer";
import { default as ConsoleLogger } from "../classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "../classes/ExceptionHandlerFilter/Unexpected";

import { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import { ClockReactiveController } from "../interfaces/ClockReactiveController";
import { Debugger } from "../interfaces/Debugger";
import { ExceptionHandler } from "../interfaces/ExceptionHandler";
import { JSONRPCServer as JSONRPCServerInterface } from "../interfaces/JSONRPCServer";
import { Logger } from "../interfaces/Logger";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import { QueryBus } from "../interfaces/QueryBus";

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
