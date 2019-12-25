// @flow

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export type UnserializerCallback<T> = (LoggerBreadcrumbs, string) => T;
