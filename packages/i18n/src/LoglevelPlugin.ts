import type { Logger } from "loglevel";
import type { LoggerModule } from "i18next";

function _concatArgs(args: Array<any>): string {
  return args.filter(_isString).join('", "');
}

function _isString(arg: any): boolean {
  return "string" === typeof arg;
}

export function LoglevelPlugin(logger: Logger): LoggerModule {
  return Object.seal({
    type: "logger",

    log(args: Array<any>) {
      logger.debug(`I18N("${_concatArgs(args)}")`);
    },
    warn(args: Array<any>) {
      logger.warn(`I18N("${_concatArgs(args)}")`);
    },
    error(args: Array<any>) {
      logger.error(`I18N("${_concatArgs(args)}")`);
    },
  });
}
