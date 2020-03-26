import type LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

import type DebuggerStateValue from "src/framework/types/DebuggerStateValue";

type DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>;

export default DebuggerState;
