import { MathUtils } from "three/src/math/MathUtils";

import { createRouter } from "@personalidol/workers/src/createRouter";

import type { StatsCollector as IStatsCollector } from "./StatsCollector.interface";
import type { StatsReport } from "./StatsReport.type";

export function StatsCollector(): IStatsCollector {
  const statsRouter = createRouter({
    statsReport: function (statsReport: StatsReport) {
      console.log(statsReport);
    }
  });

  function registerMessagePort(messagePort: MessagePort) {
    console.log("STATS.registerMessagePort", messagePort);
  }

  function start() {
  }

  function stop() {
  }

  function update() {
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
