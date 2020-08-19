import Loglevel from "loglevel";

import { AtlasService } from "@personalidol/texture-loader/src/AtlasService";
import { createSupportCache } from "@personalidol/support/src/createSupportCache";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { DOMRendererService } from "@personalidol/dom-renderer/src/DOMRendererService";
import { DOMTextureService } from "@personalidol/texture-loader/src/DOMTextureService";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { FontPreloaderService } from "@personalidol/dom-renderer/src/FontPreloaderService";
import { getHTMLCanvasElementById } from "@personalidol/framework/src/getHTMLCanvasElementById";
import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { HTMLElementResizeObserver } from "@personalidol/framework/src/HTMLElementResizeObserver";
import { Input } from "@personalidol/framework/src/Input";
import { isCanvasTransferControlToOffscreenSupported } from "@personalidol/support/src/isCanvasTransferControlToOffscreenSupported";
import { isCreateImageBitmapSupported } from "@personalidol/support/src/isCreateImageBitmapSupported";
import { isSharedArrayBufferSupported } from "@personalidol/support/src/isSharedArrayBufferSupported";
import { MainLoop } from "@personalidol/framework/src/MainLoop";
import { MouseObserver } from "@personalidol/framework/src/MouseObserver";
import { MouseWheelObserver } from "@personalidol/framework/src/MouseWheelObserver";
import { PreventDefaultInput } from "@personalidol/framework/src/PreventDefaultInput";
import { renderDOMUIRouter } from "@personalidol/personalidol/src/renderDOMUIRouter";
import { RequestAnimationFrameScheduler } from "@personalidol/framework/src/RequestAnimationFrameScheduler";
import { ServiceManager } from "@personalidol/framework/src/ServiceManager";
import { TouchObserver } from "@personalidol/framework/src/TouchObserver";
import { WorkerService } from "@personalidol/framework/src/WorkerService";

import { workers } from "./workers";

const canvas = getHTMLCanvasElementById(window, "canvas");
const devicePixelRatio = Math.min(1.5, window.devicePixelRatio);
const logger = Loglevel.getLogger("main");
const supportCache = createSupportCache();

logger.setLevel(__LOG_LEVEL);

const canvasRoot = getHTMLElementById(window, "canvas-root");
const uiRoot = getHTMLElementById(window, "ui-root");

// The entire bootstrap code is wrapped to allow 'await'. Global await is not
// widely supported yet.
// Depending on browser feature support, some workers will be started or not.
// Checking for features is asynchronous.
(async function () {
  // Services that need to stay in the main browser thread, because they need
  // access to the DOM API.

  const useSharedBuffers = await isSharedArrayBufferSupported(supportCache);
  const dimensionsState = Dimensions.createEmptyState(useSharedBuffers);
  const inputState = Input.createEmptyState(useSharedBuffers);

  const eventBus = EventBus();
  const mainLoop = MainLoop(RequestAnimationFrameScheduler());

  const htmlElementResizeObserver = HTMLElementResizeObserver(canvasRoot, dimensionsState, mainLoop.tickTimerState);

  const mouseObserver = MouseObserver(canvas, dimensionsState, inputState, mainLoop.tickTimerState);
  const serviceManager = ServiceManager(logger);
  const touchObserver = TouchObserver(canvas, dimensionsState, inputState, mainLoop.tickTimerState);

  serviceManager.services.add(htmlElementResizeObserver);
  serviceManager.services.add(mouseObserver);
  serviceManager.services.add(MouseWheelObserver(canvas, eventBus, dimensionsState, inputState));
  serviceManager.services.add(touchObserver);
  serviceManager.services.add(PreventDefaultInput(canvas));

  mainLoop.updatables.add(htmlElementResizeObserver);
  mainLoop.updatables.add(mouseObserver);
  mainLoop.updatables.add(touchObserver);
  mainLoop.updatables.add(serviceManager);

  mainLoop.start();
  serviceManager.start();

  // DOMRendererService receives messages from workers and other sources and
  // redraws the DOM in the main thread.

  const domRendererMessageChannel = new MessageChannel();
  const domRendererService = DOMRendererService(domRendererMessageChannel.port1, uiRoot, renderDOMUIRouter);

  serviceManager.services.add(domRendererService);

  // Progress worker is used to gather information about assets and other
  // resources currently being loaded. It passess the summary information back,
  // so it's possible to render loading screen or do something else with that
  // information.

  const progressMessageChannel = new MessageChannel();
  const progressWorker = new Worker(workers.progress.url, {
    credentials: "same-origin",
    name: workers.progress.name,
    type: "module",
  });

  const progressWorkerService = WorkerService(progressWorker, workers.progress.name);

  mainLoop.updatables.add(progressWorkerService);
  serviceManager.services.add(progressWorkerService);

  function addProgressMessagePort(messagePort: MessagePort, broadcastProgress: boolean) {
    progressWorker.postMessage(
      {
        progressMessagePort: {
          broadcastProgress: broadcastProgress,
          messagePort: messagePort,
        },
      },
      [messagePort]
    );
  }

  addProgressMessagePort(progressMessageChannel.port1, true);

  // FontPreloaderService does exactly what it name says. Thanks to this
  // service it is possible for worker threads to request font face to be
  // preloaded, display loading indicator  and receive notification back when
  // it's ready. Thanks to that, there should be no UI twitching while fonts
  // are being loaded.

  const fontPreloaderMessageChannel = new MessageChannel();
  const fontPreloaderToProgressMessageChannel = new MessageChannel();

  addProgressMessagePort(fontPreloaderToProgressMessageChannel.port1, false);

  const fontPreloaderService = FontPreloaderService(fontPreloaderMessageChannel.port1, fontPreloaderToProgressMessageChannel.port2);

  serviceManager.services.add(fontPreloaderService);

  // `createImageBitmap` has it's quirks and surprisingly has no support in
  // safari and ios. Also it has partial support in Firefox.
  // If it's not supported, then we have to use the main thread to
  // generate textures and potentially send them into other workers.

  const texturesMessageChannel = new MessageChannel();
  const texturesToProgressMessageChannel = new MessageChannel();

  addProgressMessagePort(texturesToProgressMessageChannel.port1, false);

  const addTextureMessagePort = await (async function () {
    if (await isCreateImageBitmapSupported(supportCache)) {
      logger.debug("SUPPORTED(createImageBitmap)");

      const texturesWorker = new Worker(workers.textures.url, {
        credentials: "same-origin",
        name: workers.textures.name,
        type: "module",
      });

      texturesWorker.postMessage(
        {
          progressMessagePort: texturesToProgressMessageChannel.port2,
        },
        [texturesToProgressMessageChannel.port2]
      );

      return function (messagePort: MessagePort) {
        texturesWorker.postMessage(
          {
            texturesMessagePort: messagePort,
          },
          [messagePort]
        );
      };
    } else {
      logger.debug("NO_SUPPORT(createImageBitmap) // starting texture service in the main thread");

      const textureCanvas = document.createElement("canvas");
      const textureCanvasContext2D = textureCanvas.getContext("2d");

      if (null === textureCanvasContext2D) {
        throw new Error("Unable to get detached canvas 2D context.");
      }

      const textureService = DOMTextureService(textureCanvas, textureCanvasContext2D, texturesToProgressMessageChannel.port2);

      mainLoop.updatables.add(textureService);
      serviceManager.services.add(textureService);

      return textureService.registerMessagePort;
    }
  })();

  addTextureMessagePort(texturesMessageChannel.port1);

  // Atlas canvas is used to speed up texture atlas creation. If this context is
  // not supported.

  const atlasCanvas = document.createElement("canvas");
  const atlasMessageChannel = new MessageChannel();
  const atlasToTextureMessageChannel = new MessageChannel();
  const atlasToProgressMessageChannel = new MessageChannel();

  addProgressMessagePort(atlasToProgressMessageChannel.port1, false);
  addTextureMessagePort(atlasToTextureMessageChannel.port1);

  const addAtlasMessagePort = await (async function () {
    if (await isCanvasTransferControlToOffscreenSupported(supportCache)) {
      logger.debug("SUPPORTED(canvas.transferControlToOffscreen)");

      const offscreenAtlas = atlasCanvas.transferControlToOffscreen();
      const atlasWorker = new Worker(workers.atlas.url, {
        credentials: "same-origin",
        name: workers.atlas.name,
        type: "module",
      });

      atlasWorker.postMessage(
        {
          atlasCanvas: offscreenAtlas,
          progressMessagePort: atlasToProgressMessageChannel.port2,
          texturesMessagePort: atlasToTextureMessageChannel.port2,
        },
        [atlasToProgressMessageChannel.port2, atlasToTextureMessageChannel.port2, offscreenAtlas]
      );

      const atlasWorkerService = WorkerService(atlasWorker, workers.atlas.name);

      mainLoop.updatables.add(atlasWorkerService);
      serviceManager.services.add(atlasWorkerService);

      return function (messagePort: MessagePort) {
        atlasWorker.postMessage(
          {
            atlasMessagePort: messagePort,
          },
          [messagePort]
        );
      };
    } else {
      logger.debug("NO_SUPPORT(canvas.transferControlToOffscreen) // starting atlas service in the main thread");

      const atlasCanvasContext2D = atlasCanvas.getContext("2d");

      if (null === atlasCanvasContext2D) {
        throw new Error("Unable to get atlas canvas 2D context.");
      }

      const atlasService = AtlasService(atlasCanvas, atlasCanvasContext2D, atlasToProgressMessageChannel.port2, atlasToTextureMessageChannel.port2);

      mainLoop.updatables.add(atlasService);
      serviceManager.services.add(atlasService);

      return atlasService.registerMessagePort;
    }
  })();

  addAtlasMessagePort(atlasMessageChannel.port1);

  // Workers can share a message channel if necessary. If there is no offscreen
  // worker then the message channel can be used in the main thread. It is an
  // overhead, but unifies how messages are handled in each case.

  const quakeMapsMessageChannel = new MessageChannel();
  const quakeMapsToProgressMessageChannel = new MessageChannel();

  addProgressMessagePort(quakeMapsToProgressMessageChannel.port1, false);

  const quakeMapsWorker = new Worker(workers.quakemaps.url, {
    credentials: "same-origin",
    name: workers.quakemaps.name,
    type: "module",
  });

  quakeMapsWorker.postMessage(
    {
      atlasMessagePort: atlasMessageChannel.port2,
      progressMessagePort: quakeMapsToProgressMessageChannel.port2,
      quakeMapsMessagePort: quakeMapsMessageChannel.port1,
    },
    [atlasMessageChannel.port2, quakeMapsMessageChannel.port1, quakeMapsToProgressMessageChannel.port2]
  );

  // MD2 worker offloads model loading from the thread whether it's the main
  // browser thread or the offscreen canvas thread. Loading MD2 models cause
  // rendering to stutter.

  const md2MessageChannel = new MessageChannel();
  const md2ToProgressMessageChannel = new MessageChannel();

  addProgressMessagePort(md2ToProgressMessageChannel.port1, false);

  const md2Worker = new Worker(workers.md2.url, {
    credentials: "same-origin",
    name: workers.md2.name,
    type: "module",
  });

  md2Worker.postMessage(
    {
      md2MessagePort: md2MessageChannel.port1,
      progressMessagePort: md2ToProgressMessageChannel.port2,
    },
    [md2MessageChannel.port1, md2ToProgressMessageChannel.port2]
  );

  // If browser supports the offscreen canvas, then we can offload everything
  // there. If not, then we continue in the main thread.

  if (await isCanvasTransferControlToOffscreenSupported(supportCache)) {
    logger.debug("SUPPORTED(canvas.transferControlToOffscreen)");

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
    const offscreenWorkerService = (function () {
      function sharedArrayBufferNotAvailable() {
        logger.debug("NO_SUPPORT(SharedArrayBuffer) // starting dimensions/input sync service");

        offscreenWorker.postMessage({
          awaitSharedDimensions: false,
        });

        let _lastNotificationTick = 0;
        const updateMessage = {
          dimensionsState: dimensionsState,
          inputState: inputState,
        };

        return WorkerService(offscreenWorker, workers.offscreen.name, function () {
          // prettier-ignore
          if ( _lastNotificationTick < dimensionsState[Dimensions.code.LAST_UPDATE]
            || _lastNotificationTick < inputState[Input.code.LAST_UPDATE]
          ) {
            offscreenWorker.postMessage(updateMessage);;
            _lastNotificationTick = mainLoop.tickTimerState.currentTick;
          }
        });
      }

      if (useSharedBuffers) {
        try {
          offscreenWorker.postMessage({
            awaitSharedDimensions: true,
            sharedDimensionsState: dimensionsState.buffer,
            sharedInputState: inputState.buffer,
          });
        } catch (err) {
          // In some cases, `postMessage` will throw when trying to send
          // SharedArrayBuffer to a worker. In that case we can fallback to
          // the copy / update strategy.
          return sharedArrayBufferNotAvailable();
        }

        logger.debug("SUPPORTED(SharedArrayBuffer) // sharing dimensions/input array with worker");

        return WorkerService(offscreenWorker, workers.offscreen.name);
      } else {
        return sharedArrayBufferNotAvailable();
      }
    })();

    // prettier-ignore
    offscreenWorker.postMessage(
      {
        canvas: offscreenCanvas,
        devicePixelRatio: devicePixelRatio,
        domMessagePort: domRendererMessageChannel.port2,
        fontPreloaderMessagePort: fontPreloaderMessageChannel.port2,
        md2MessagePort: md2MessageChannel.port2,
        progressMessagePort: progressMessageChannel.port2,
        quakeMapsMessagePort: quakeMapsMessageChannel.port2,
        texturesMessagePort: texturesMessageChannel.port2,
      },
      [
        domRendererMessageChannel.port2,
        fontPreloaderMessageChannel.port2,
        md2MessageChannel.port2,
        offscreenCanvas,
        progressMessageChannel.port2,
        quakeMapsMessageChannel.port2,
        texturesMessageChannel.port2
      ]
    );

    const offscreenWorkerZoomRequestMessage = {
      pointerZoomRequest: 0,
    };

    eventBus.POINTER_ZOOM_REQUEST.add(function (zoomAmount: number): void {
      offscreenWorkerZoomRequestMessage.pointerZoomRequest = zoomAmount;
      offscreenWorker.postMessage(offscreenWorkerZoomRequestMessage);
    });

    mainLoop.updatables.add(offscreenWorkerService);
    serviceManager.services.add(offscreenWorkerService);
  } else {
    logger.debug("NO_SUPPORT(canvas.transferControlToOffscreen) // starting 3D canvas in the main thread");

    // This extra var is a hack to make esbuild leave the dynamic import as-is.
    // https://github.com/evanw/esbuild/issues/56#issuecomment-643100248
    const filename = "/lib/createScenes.js";
    const { createScenes } = await import(filename);

    // prettier-ignore
    createScenes(
      devicePixelRatio,
      eventBus,
      mainLoop,
      serviceManager,
      canvas,
      dimensionsState,
      inputState,
      logger,
      domRendererMessageChannel.port2,
      fontPreloaderMessageChannel.port2,
      md2MessageChannel.port2,
      progressMessageChannel.port2,
      quakeMapsMessageChannel.port2,
      texturesMessageChannel.port2,
    );
  }
})();
