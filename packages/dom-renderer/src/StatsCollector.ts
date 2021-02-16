import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/framework/src/createRouter";

import type { StatsReport } from "@personalidol/framework/src/StatsReport.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";
import type { StatsCollector as IStatsCollector } from "./StatsCollector.interface";

type StatsHooksReports = {
  [key: string]: StatsReport;
};

export function StatsCollector(domMessagePort: MessagePort): IStatsCollector {
  const _domStatsReporterElementId: string = MathUtils.generateUUID();
  const _statsReports: StatsHooksReports = {};
  const _statsRouter = createRouter({
    statsReport: function (statsReport: StatsReport) {
      _statsReports[statsReport.debugName] = statsReport;
    },
  });

  function registerMessagePort(messagePort: MessagePort) {
    messagePort.onmessage = _statsRouter;
  }

  function start() {}

  function stop() {}

  function update(delta: number) {
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

    registerMessagePort: registerMessagePort,
    start: start,
    stop: stop,
    update: update,
  });
}
