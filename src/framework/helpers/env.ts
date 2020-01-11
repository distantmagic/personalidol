// @flow strict

import { default as EnvironmentException } from "../classes/Exception/Environment";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export default function env(loggerBreadcrumbs: LoggerBreadcrumbs, name: string, dft: ?string = null): string {
  const value = process.env[name];

  if ("string" === typeof value) {
    return value;
  }

  if ("string" === typeof dft) {
    return dft;
  }

  throw new EnvironmentException(loggerBreadcrumbs, `Environment variable is not defined and has no default value, but it was expected: "${name}"`);
}
