import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";

import type { MainLoopUpdatableState } from "@personalidol/framework/src/MainLoopUpdatableState.type";
import type { StatsReport } from "@personalidol/framework/src/StatsReport.type";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";
import type { StatsCollector as IStatsCollector } from "./StatsCollector.interface";

type StatsHooksReports = {
  [key: string]: StatsReport;
};

export function StatsCollector(userSettings: UserSettings, domMessagePort: MessagePort): IStatsCollector {
  const state: MainLoopUpdatableState = Object.seal({
    needsUpdates: true,
  });

  const _statsReports: StatsHooksReports = {};
  const _statsRouter = createRouter({
    statsReport: function (statsReport: StatsReport) {
      _statsReports[statsReport.debugName] = statsReport;
    },
  });

  let _domStatsReporterElementId: null | string;

  function registerMessagePort(messagePort: MessagePort) {
    messagePort.onmessage = _statsRouter;
  }

  function start() {}

  function stop() {
    if (!_domStatsReporterElementId) {
      return;
    }

    domMessagePort.postMessage({
      dispose: <MessageDOMUIDispose>[_domStatsReporterElementId],
    });

    _domStatsReporterElementId = null;
  }

  function update(delta: number) {
    if (!_domStatsReporterElementId) {
      _domStatsReporterElementId = MathUtils.generateUUID();
    }

    domMessagePort.postMessage({
      render: <MessageDOMUIRender<DOMElementsLookup>>{
        id: _domStatsReporterElementId,
        element: "pi-stats-reporter",
        props: {
          statsReports: Object.values(_statsReports),
        },
      },
    });
  }

  return Object.freeze({
    id: MathUtils.generateUUID(),
    name: "StatsCollector",
    state: state,

    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
