import { createMultiThreadMessageChannel } from "@personalidol/framework/src/createMultiThreadMessageChannel";
import { createSingleThreadMessageChannel } from "@personalidol/framework/src/createSingleThreadMessageChannel";
import { DimensionsIndices } from "@personalidol/framework/src/DimensionsIndices.enum";
import { isCanvasTransferControlToOffscreenSupported } from "@personalidol/framework/src/isCanvasTransferControlToOffscreenSupported";
import { isSharedArrayBufferSupported } from "@personalidol/framework/src/isSharedArrayBufferSupported";
import { prefetch } from "@personalidol/framework/src/prefetch";
import { WorkerServiceClient } from "@personalidol/framework/src/WorkerServiceClient";

import { workers } from "./workers";

import type { Logger } from "loglevel";

import type { DOMElementsLookup } from "@personalidol/personalidol/src/DOMElementsLookup.type";
import type { DOMUIController } from "@personalidol/dom-renderer/src/DOMUIController.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { KeyboardObserverState } from "@personalidol/input/src/KeyboardObserverState.type";
import type { MainLoop } from "@personalidol/framework/src/MainLoop.interface";
import type { MouseObserverState } from "@personalidol/input/src/MouseObserverState.type";
import type { ServiceManager } from "@personalidol/framework/src/ServiceManager.interface";
import type { StatsReporter } from "@personalidol/framework/src/StatsReporter.interface";
import type { TouchObserverState } from "@personalidol/input/src/TouchObserverState.type";
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
  keyboardObserverState: KeyboardObserverState,
  keyboardState: Uint8Array,
  mouseObserverState: MouseObserverState,
  mouseState: Int32Array,
  touchState: Int32Array,
  statsReporter: StatsReporter,
  threadDebugName: string,
  touchObserverState: TouchObserverState,
  userSettings: UserSettings,
  websiteToProgressMessagePort: MessagePort
) {
  if (userSettings.useOffscreenCanvas && isCanvasTransferControlToOffscreenSupported()) {
    logger.debug("SUPPORTED(canvas.transferControlToOffscreen) // offlad 3D canvas to a worker thread");

    const domRendererMessageChannel = createMultiThreadMessageChannel();

    domUIController.registerMessagePort(domRendererMessageChannel.port1);

    await prefetch(websiteToProgressMessagePort, "worker", workers.offscreen.url);

    const offscreenWorker = new Worker(workers.offscreen.url, {
      credentials: "same-origin",
      name: workers.offscreen.name,
      type: "module",
    });

    const offscreenCanvas = canvas.transferControlToOffscreen();

    // SharedArrayBuffer was disabled after Spectre / Meltdown attacks.
    // After some time it got enabled again, so it's a bit messy.
    // If it's enabled, then we should use it, otherwise the app will be sending
    // copy of input / dimensions states every frame to the worker.
    const offscreenWorkerServiceClient = (function () {
      function sharedArrayBufferNotAvailable() {
        logger.debug("NO_SUPPORT(SharedArrayBuffer) // starting dimensions/input sync service");

        let _lastNotificationTicks = {
          dimensionsState: -1,
          keyboardState: -1,
          mouseState: -1,
          touchState: -1,
        };

        function updateStateArrays(): void {
          if (_lastNotificationTicks.dimensionsState < dimensionsState[DimensionsIndices.LAST_UPDATE]) {
            offscreenWorker.postMessage({
              dimensionsState: dimensionsState,
            });
            _lastNotificationTicks.dimensionsState = dimensionsState[DimensionsIndices.LAST_UPDATE];
          }

          if (_lastNotificationTicks.keyboardState < keyboardObserverState.lastUpdate) {
            offscreenWorker.postMessage({
              keyboardState: keyboardState,
            });
            _lastNotificationTicks.keyboardState = keyboardObserverState.lastUpdate;
          }

          if (_lastNotificationTicks.mouseState < mouseObserverState.lastUpdate) {
            offscreenWorker.postMessage({
              mouseState: mouseState,
            });
            _lastNotificationTicks.mouseState = mouseObserverState.lastUpdate;
          }

          if (_lastNotificationTicks.touchState < touchObserverState.lastUpdate) {
            offscreenWorker.postMessage({
              touchState: touchState,
            });
            _lastNotificationTicks.touchState = touchObserverState.lastUpdate;
          }
        }

        updateStateArrays();

        return WorkerServiceClient(offscreenWorker, workers.offscreen.name, updateStateArrays);
      }

      if (isSharedArrayBufferSupported()) {
        try {
          offscreenWorker.postMessage({
            sharedDimensionsState: dimensionsState.buffer,
            sharedKeyboardState: keyboardState.buffer,
            sharedMouseState: mouseState.buffer,
            sharedTouchState: touchState.buffer,
          });
        } catch (err) {
          // In some cases, `postMessage` will throw when trying to send
          // SharedArrayBuffer to a worker. In that case we can fallback to
          // the copy / update strategy.
          return sharedArrayBufferNotAvailable();
        }

        logger.debug("SUPPORTED(SharedArrayBuffer) // sharing dimensions/input memory array between threads");

        return WorkerServiceClient(offscreenWorker, workers.offscreen.name);
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

      await offscreenWorkerServiceClient.ready();

      mainLoop.updatables.add(offscreenWorkerServiceClient);
      serviceManager.services.add(offscreenWorkerServiceClient);
    };
  } else {
    if (isCanvasTransferControlToOffscreenSupported()) {
      logger.debug("DISABLED(SUPPORTED(canvas.transferControlToOffscreen)) // starting 3D canvas in the main thread");
    } else {
      logger.debug("NO_SUPPORT(canvas.transferControlToOffscreen) // starting 3D canvas in the main thread");
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
      const _dynamicImport = `${__STATIC_BASE_PATH}/lib/createScenes_${__BUILD_ID}.js`;

      await prefetch(websiteToProgressMessagePort, "worker", _dynamicImport);

      // This block is here to supress esbuild warnings about importing a
      // module that may not exist.
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
        false,
        eventBus,
        mainLoop,
        serviceManager,
        canvas,
        dimensionsState,
        keyboardState,
        mouseState,
        touchState,
        logger,
        statsReporter,
        userSettings,
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
