import { createMultiThreadMessageChannel } from "@personalidol/framework/src/createMultiThreadMessageChannel";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";
import { isCanvasTransferControlToOffscreenSupported } from "@personalidol/support/src/isCanvasTransferControlToOffscreenSupported";
import { isSharedArrayBufferSupported } from "@personalidol/support/src/isSharedArrayBufferSupported";
import { KeyboardIndices } from "@personalidol/framework/src/KeyboardIndices.enum";
import { PointerIndices } from "@personalidol/framework/src/PointerIndices.enum";
import { WorkerService } from "@personalidol/framework/src/WorkerService";

import workers from "./workers.json";

import type { Logger } from "loglevel";

import type { DOMElementsLookup } from "@personalidol/personalidol/src/DOMElementsLookup.type";
import type { DOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";
import type { StatsReporter } from "@personalidol/framework/src/StatsReporter.interface";
import type { UserSettings } from "@personalidol/personalidol/src/UserSettings.type";

export async function createRenderingService(
  logger: Logger,
  mainLoop: MainLoop,
  serviceManager: ServiceManager,
  canvas: HTMLCanvasElement,
  devicePixelRatio: number,
  domUIController: DOMUIController<DOMElementsLookup, UserSettings>,
  dimensionsState: Uint32Array,
  eventBus: EventBus,
  keyboardState: Uint32Array,
  pointerState: Int32Array,
  statsReporter: StatsReporter,
  threadDebugName: string,
  userSettings: UserSettings
) {
  if (userSettings.useOffscreenCanvas && isCanvasTransferControlToOffscreenSupported()) {
    logger.info("SUPPORTED(canvas.transferControlToOffscreen) // offlad 3D canvas to a worker thread");

    const domRendererMessageChannel = createMultiThreadMessageChannel();

    domUIController.registerMessagePort(domRendererMessageChannel.port1);

    const offscreenWorker = new Worker(`${__STATIC_BASE_PATH}${workers.offscreen.url}?${__CACHE_BUST}`, {
      credentials: "same-origin",
      name: workers.offscreen.name,
      type: "module",
    });

    const offscreenCanvas = canvas.transferControlToOffscreen();

    // SharedArrayBuffer was disabled after Spectre / Meltdown attacks.
    // After some time it got enabled again, so it's a bit messy.
    // If it's enabled, then we should use it, otherwise the app will be sending
    // copy of input / dimensions states every frame to the worker.
    const offscreenWorkerService = (function () {
      function sharedArrayBufferNotAvailable() {
        logger.info("NO_SUPPORT(SharedArrayBuffer) // starting dimensions/input sync service");

        offscreenWorker.postMessage({
          awaitSharedDimensions: false,
        });

        let _lastNotificationTick = 0;
        const updateMessage = {
          dimensionsState: dimensionsState,
          keyboardState: keyboardState,
          pointerState: pointerState,
        };

        return WorkerService(offscreenWorker, workers.offscreen.name, function () {
          // prettier-ignore
          if ( _lastNotificationTick < dimensionsState[DimensionsIndices.LAST_UPDATE]
            || _lastNotificationTick < keyboardState[KeyboardIndices.LAST_UPDATE]
            || _lastNotificationTick < pointerState[PointerIndices.LAST_UPDATE]
          ) {
            offscreenWorker.postMessage(updateMessage);
            _lastNotificationTick = mainLoop.tickTimerState.currentTick;
          }
        });
      }

      if (isSharedArrayBufferSupported()) {
        try {
          offscreenWorker.postMessage({
            awaitSharedDimensions: true,
            sharedDimensionsState: dimensionsState.buffer,
            sharedKeyboardState: keyboardState.buffer,
            sharedPointerState: pointerState.buffer,
          });
        } catch (err) {
          // In some cases, `postMessage` will throw when trying to send
          // SharedArrayBuffer to a worker. In that case we can fallback to
          // the copy / update strategy.
          return sharedArrayBufferNotAvailable();
        }

        logger.info("SUPPORTED(SharedArrayBuffer) // sharing dimensions/input memory array between threads");

        return WorkerService(offscreenWorker, workers.offscreen.name);
      } else {
        return sharedArrayBufferNotAvailable();
      }
    })();

    return async function (
      fontPreloadMessagePort: MessagePort,
      gltfMessagePort: MessagePort,
      internationalizationMessagePort: MessagePort,
      md2MessagePort: MessagePort,
      progressMessagePort: MessagePort,
      quakeMapsMessagePort: MessagePort,
      statsMessagePort: MessagePort,
      texturesMessagePort: MessagePort,
      uiMessagePort: MessagePort,
      userSettingsMessagePort: MessagePort
    ) {
      // prettier-ignore
      offscreenWorker.postMessage(
        {
          canvas: offscreenCanvas,
          devicePixelRatio: devicePixelRatio,
          domMessagePort: domRendererMessageChannel.port2,
          fontPreloadMessagePort: fontPreloadMessagePort,
          gltfMessagePort: gltfMessagePort,
          internationalizationMessagePort: internationalizationMessagePort,
          md2MessagePort: md2MessagePort,
          progressMessagePort: progressMessagePort,
          quakeMapsMessagePort: quakeMapsMessagePort,
          statsMessagePort: statsMessagePort,
          texturesMessagePort: texturesMessagePort,
          uiMessagePort: uiMessagePort,
          userSettingsMessagePort: userSettingsMessagePort,
        },
        [
          domRendererMessageChannel.port2,
          fontPreloadMessagePort,
          gltfMessagePort,
          internationalizationMessagePort,
          md2MessagePort,
          offscreenCanvas,
          statsMessagePort,
          progressMessagePort,
          quakeMapsMessagePort,
          texturesMessagePort,
          uiMessagePort,
          userSettingsMessagePort,
        ]
      );

      const offscreenWorkerZoomRequestMessage = {
        pointerZoomRequest: 0,
      };

      eventBus.POINTER_ZOOM_REQUEST.add(function (zoomAmount: number): void {
        offscreenWorkerZoomRequestMessage.pointerZoomRequest = zoomAmount;
        offscreenWorker.postMessage(offscreenWorkerZoomRequestMessage);
      });

      await offscreenWorkerService.ready();

      mainLoop.updatables.add(offscreenWorkerService);
      serviceManager.services.add(offscreenWorkerService);
    };
  } else {
    if (isCanvasTransferControlToOffscreenSupported()) {
      logger.info("DISABLED(SUPPORTED(canvas.transferControlToOffscreen)) // starting 3D canvas in the main thread");
    } else {
      logger.info("NO_SUPPORT(canvas.transferControlToOffscreen) // starting 3D canvas in the main thread");
    }

    const domRendererMessageChannel = createSingleThreadMessageChannel();

    domUIController.registerMessagePort(domRendererMessageChannel.port1);

    return async function (
      fontPreloadMessagePort: MessagePort,
      gltfMessagePort: MessagePort,
      internationalizationMessagePort: MessagePort,
      md2MessagePort: MessagePort,
      progressMessagePort: MessagePort,
      quakeMapsMessagePort: MessagePort,
      statsMessagePort: MessagePort,
      texturesMessagePort: MessagePort,
      uiMessagePort: MessagePort,
      userSettingsMessagePort: MessagePort
    ) {
      /**
       * This extra var is a hack to make esbuild leave the dynamic import as-is.
       * @see https://github.com/evanw/esbuild/issues/56#issuecomment-643100248
       * @see https://github.com/evanw/esbuild/issues/113
       */
      const _dynamicImport = `${__STATIC_BASE_PATH}/lib/createScenes.js`;
      const { createScenes } = await (async function () {
        try {
          return await import(_dynamicImport);
        } catch (err) {
          throw err;
        }
      })();

      // prettier-ignore
      return createScenes(
        threadDebugName,
        devicePixelRatio,
        eventBus,
        mainLoop,
        serviceManager,
        canvas,
        dimensionsState,
        keyboardState,
        pointerState,
        logger,
        statsReporter,
        domRendererMessageChannel.port2,
        fontPreloadMessagePort,
        gltfMessagePort,
        internationalizationMessagePort,
        md2MessagePort,
        progressMessagePort,
        quakeMapsMessagePort,
        statsMessagePort,
        texturesMessagePort,
        uiMessagePort,
        userSettingsMessagePort,
      );
    };
  }
}
