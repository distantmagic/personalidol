import { DOMTextureService } from "@personalidol/texture-loader/src/DOMTextureService";
import { isCreateImageBitmapSupported } from "@personalidol/support/src/isCreateImageBitmapSupported";
import { WorkerService } from "@personalidol/framework/src/WorkerService";

import workers from "./workers.json";

import type { Logger } from "loglevel";

import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";

export async function createTexturesService(logger: Logger, mainLoop: MainLoop, serviceManager: ServiceManager, progressMessagePort: MessagePort): Promise<RegistersMessagePort> {
  const textureCanvas = document.createElement("canvas");
  const textureCanvasContext2D = textureCanvas.getContext("2d");

  if (null === textureCanvasContext2D) {
    throw new Error("Unable to get detached canvas 2D context.");
  }

  return (async function () {
    if (await isCreateImageBitmapSupported()) {
      logger.info("SUPPORTED(createImageBitmap) // offload texture service to a worker thread");

      const texturesWorker = new Worker(`${__STATIC_BASE_PATH}${workers.textures.url}?${__CACHE_BUST}`, {
        credentials: "same-origin",
        name: workers.textures.name,
        type: "module",
      });

      const texturesWorkerService = WorkerService(texturesWorker, workers.textures.name);
      await texturesWorkerService.ready();

      texturesWorker.postMessage(
        {
          progressMessagePort: progressMessagePort,
        },
        [progressMessagePort]
      );

      return Object.freeze({
        registerMessagePort(messagePort: MessagePort) {
          texturesWorker.postMessage(
            {
              texturesMessagePort: messagePort,
            },
            [messagePort]
          );
        },
      });
    } else {
      logger.info("NO_SUPPORT(createImageBitmap) // starting texture service in the main thread");

      const textureService = DOMTextureService(textureCanvas, textureCanvasContext2D, progressMessagePort);

      mainLoop.updatables.add(textureService);
      serviceManager.services.add(textureService);

      return textureService;
    }
  })();
}
