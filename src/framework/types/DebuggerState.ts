import { Map } from "immutable";

import { DebuggerStateValue } from "src/framework/types/DebuggerStateValue";
import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

export type DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>;
