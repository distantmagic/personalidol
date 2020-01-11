import { Map } from "immutable";

import { DebuggerStateValue } from "./DebuggerStateValue";
import { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>;
