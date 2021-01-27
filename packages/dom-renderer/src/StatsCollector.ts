import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";

import { reduceStatHooksReports } from "./reduceStatHooksReports";

import type { StatsCollectorReport } from "@personalidol/framework/src/StatsCollectorReport.type";
import type { StatsHookReportMessage } from "@personalidol/framework/src/StatsHookReportMessage.type";

import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";
import type { StatsCollector as IStatsCollector } from "./StatsCollector.interface";

const INTERVAL_S: number = 0.5;
const MAX_REPORTS = 10;

type StatsHooksReports = {
  [key: string]: Array<StatsHookReportMessage>;
};

export function StatsCollector(domMessagePort: MessagePort): IStatsCollector {
  const statsCollectorReports: Array<StatsCollectorReport> = [];

  const _domStatsReporterElementId: string = MathUtils.generateUUID();
  const _statsHooksReports: StatsHooksReports = {};
  const _statsRouter = createRouter({
    statsReport: function (statsReport: StatsHookReportMessage) {
      if (!_statsHooksReports.hasOwnProperty(statsReport.debugName)) {
        _statsHooksReports[statsReport.debugName] = [];
      }

      _statsHooksReports[statsReport.debugName].push(statsReport);

      if (_statsHooksReports[statsReport.debugName].length >= MAX_REPORTS) {
        _statsHooksReports[statsReport.debugName].shift();
      }
    },
  });

  let _currentIntervalDuration: number = 0;

  function _reportInterval() {
    while (statsCollectorReports.length > 0) {
      statsCollectorReports.pop();
    }

    for (let [debugName, statsHookReports] of Object.entries(_statsHooksReports)) {
      statsCollectorReports.push(reduceStatHooksReports(debugName, statsHookReports));
    }

    domMessagePort.postMessage({
      render: <MessageDOMUIRender>{
        id: _domStatsReporterElementId,
        element: "pi-stats-reporter",
        props: {
          statsCollectorReports: statsCollectorReports,
        },
      },
    });
  }

  function _resetInterval() {
    _currentIntervalDuration = 0;
  }

  function registerMessagePort(messagePort: MessagePort) {
    messagePort.onmessage = _statsRouter;
  }

  function start() {}

  function stop() {}

  function update(delta: number) {
    _currentIntervalDuration += delta;

    if (_currentIntervalDuration >= INTERVAL_S) {
      _reportInterval();
      _resetInterval();
    }
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "StatsCollector",
    reports: statsCollectorReports,

    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
