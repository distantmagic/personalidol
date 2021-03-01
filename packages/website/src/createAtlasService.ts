import { AtlasService } from "@personalidol/texture-loader/src/AtlasService";
import { isCanvasTransferControlToOffscreenSupported } from "@personalidol/support/src/isCanvasTransferControlToOffscreenSupported";
import { WorkerService } from "@personalidol/framework/src/WorkerService";

import workers from "./workers.json";

import type { Logger } from "loglevel";

import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";

export function createAtlasService(
  logger: Logger,
  mainLoop: MainLoop,
  serviceManager: ServiceManager,
  progressMessagePort: MessagePort,
  statsMessagePort: MessagePort,
  texturesMessagePort: MessagePort
): Promise<RegistersMessagePort> {
  const atlasCanvas = document.createElement("canvas");

  return (async function () {
    // "userSettings.useOffscreenCanvas" does not relate to the atlas canvas,
    // because it's a utility worker, not the primary rendering thread.
    if (isCanvasTransferControlToOffscreenSupported()) {
      logger.info("SUPPORTED(canvas.transferControlToOffscreen) // offlad atlas service to a worker thread");

      const offscreenAtlas = atlasCanvas.transferControlToOffscreen();
      const atlasWorker = new Worker(`${__STATIC_BASE_PATH}${workers.atlas.url}?${__CACHE_BUST}`, {
        credentials: "same-origin",
        name: workers.atlas.name,
        type: "module",
      });

      atlasWorker.postMessage(
        {
          atlasCanvas: offscreenAtlas,
          progressMessagePort: progressMessagePort,
          statsMessagePort: statsMessagePort,
          texturesMessagePort: texturesMessagePort,
        },
        [progressMessagePort, statsMessagePort, texturesMessagePort, offscreenAtlas]
      );

      const atlasWorkerService = WorkerService(atlasWorker, workers.atlas.name);
      await atlasWorkerService.ready();

      mainLoop.updatables.add(atlasWorkerService);
      serviceManager.services.add(atlasWorkerService);

      return Object.freeze({
        registerMessagePort(messagePort: MessagePort) {
          atlasWorker.postMessage(
            {
              atlasMessagePort: messagePort,
            },
            [messagePort]
          );
        },
      });
    } else {
      logger.info("NO_SUPPORT(canvas.transferControlToOffscreen) // starting atlas service in the main thread");

      const atlasCanvasContext2D = atlasCanvas.getContext("2d");

      if (null === atlasCanvasContext2D) {
        throw new Error("Unable to get atlas canvas 2D context.");
      }

      const atlasService = AtlasService(atlasCanvas, atlasCanvasContext2D, progressMessagePort, texturesMessagePort);

      serviceManager.services.add(atlasService);

      return atlasService;
    }
  })();
}
