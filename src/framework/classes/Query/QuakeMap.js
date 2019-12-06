// @flow

import QuakeMapParser from "../QuakeMapParser";
import RemoteText from "./RemoteText";

import type { CancelToken } from "../../interfaces/CancelToken";
import type { LoggerBreadcrumbs } from "../../interfaces/LoggerBreadcrumbs";
import type { QuakeMap as QuakeMapInterface } from "../../interfaces/QuakeMap";
import type { Query } from "../../interfaces/Query";

// import type { PrimaryWorker as PrimaryWorkerInterface } from "./framework/interfaces/PrimaryWorker";

// those are a few hacks, but in the end it's possible to load web workers
// with create-react-app without ejecting
//
/* eslint-disable import/no-webpack-loader-syntax */
// $FlowFixMe
// import PrimaryWorker from "workerize-loader!./worker";
/* eslint-enable import/no-webpack-loader-syntax */

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
