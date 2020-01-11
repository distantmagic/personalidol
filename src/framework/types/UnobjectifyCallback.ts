// @flow strict

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type UnobjectifyCallback<T, U> = (LoggerBreadcrumbs, T) => U;
