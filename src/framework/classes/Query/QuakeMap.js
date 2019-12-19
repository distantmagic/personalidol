// @flow

import QuakeMapParser from "../QuakeMapParser";
import RemoteText from "./RemoteText";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeMap as QuakeMapInterface } from "../../interfaces/QuakeMap";
import type { Query } from "../../interfaces/Query";

export default class QuakeMap implements Query<QuakeMapInterface> {
  +loggerBreadcrumbs: LoggerBreadcrumbs;
  +remoteText: RemoteText;

  constructor(loggerBreadcrumbs: LoggerBreadcrumbs, ref: string) {
    this.loggerBreadcrumbs = loggerBreadcrumbs;
    this.remoteText = new RemoteText(ref);
  }

  async execute(cancelToken: CancelToken): Promise<QuakeMapInterface> {
    const content = await this.remoteText.execute(cancelToken);
    const quakeMap = new QuakeMapParser(this.loggerBreadcrumbs.add("execute").add("QuakeMapParser"), content);

    return quakeMap.parse();
  }

  isEqual(other: QuakeMap): boolean {
    return this.remoteText.isEqual(other.remoteText);
  }
}
