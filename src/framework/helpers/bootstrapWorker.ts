// @flow strict

import bootstrapFramework from "./bootstrapFramework";
import BusClock from "../classes/BusClock";
import CancelToken from "../classes/CancelToken";
import JSONRPCServer from "../classes/JSONRPCServer";
import { default as ConsoleLogger } from "../classes/Logger/Console";
import { default as UnexpectedExceptionHandlerFilter } from "../classes/ExceptionHandlerFilter/Unexpected";

import type { CancelToken as CancelTokenInterface } from "../interfaces/CancelToken";
import type { ClockReactiveController } from "../interfaces/ClockReactiveController";
import type { Debugger } from "../interfaces/Debugger";
import type { ExceptionHandler } from "../interfaces/ExceptionHandler";
import type { JSONRPCServer as JSONRPCServerInterface } from "../interfaces/JSONRPCServer";
import type { Logger } from "../interfaces/Logger";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../interfaces/QueryBus";

// prettier-ignore
type BootstrapWorkerCallback = (
  CancelTokenInterface,
  LoggerBreadcrumbs,
  JSONRPCServerInterface,
  QueryBus
) => void;

export default function bootstrapWorker(bootstrapper: BootstrapWorkerCallback): $PropertyType<DedicatedWorkerGlobalScope, "onmessage"> {
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
