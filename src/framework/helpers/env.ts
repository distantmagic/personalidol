import { default as EnvironmentException } from "src/framework/classes/Exception/Environment";

import LoggerBreadcrumbs from "src/framework/interfaces/LoggerBreadcrumbs";

export default function env(loggerBreadcrumbs: LoggerBreadcrumbs, name: string, dft: null | string = null): string {
  const value = process.env[name];

  if ("string" === typeof value) {
    return value;
  }

  if ("string" === typeof dft) {
    return dft;
  }

  throw new EnvironmentException(loggerBreadcrumbs, `Environment variable is not defined and has no default value, but it was expected: "${name}"`);
}
