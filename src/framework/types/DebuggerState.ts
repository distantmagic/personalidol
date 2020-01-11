// @flow strict

import type { Map } from "immutable";

import type { DebuggerStateValue } from "./DebuggerStateValue";
import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type DebuggerState = Map<LoggerBreadcrumbs, DebuggerStateValue>;
