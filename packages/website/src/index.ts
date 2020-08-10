import Loglevel from "loglevel";

import { AtlasService } from "@personalidol/texture-loader/src/AtlasService";
import { Dimensions } from "@personalidol/framework/src/Dimensions";
import { DOMRendererService } from "@personalidol/dom-renderer/src/DOMRendererService";
import { DOMTextureService } from "@personalidol/texture-loader/src/DOMTextureService";
import { EventBus } from "@personalidol/framework/src/EventBus";
import { getHTMLCanvasElementById } from "@personalidol/framework/src/getHTMLCanvasElementById";
import { getHTMLElementById } from "@personalidol/framework/src/getHTMLElementById";
import { HTMLElementResizeObserver } from "@personalidol/framework/src/HTMLElementResizeObserver";
import { Input } from "@personalidol/framework/src/Input";
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

logger.setLevel(__LOG_LEVEL);

const canvasRoot = getHTMLElementById(window, "canvas-root");
const uiRoot = getHTMLElementById(window, "ui-root");

// Services that need to stay in the main browser thread, because they need
// access to the DOM API.

const dimensionsState = Dimensions.createEmptyState();
const inputState = Input.createEmptyState();

const eventBus = EventBus();
const htmlElementResizeObserver = HTMLElementResizeObserver(canvasRoot, dimensionsState);

const mainLoop = MainLoop(RequestAnimationFrameScheduler());
const mouseObserver = MouseObserver(canvas, dimensionsState, inputState);
const serviceManager = ServiceManager();
const touchObserver = TouchObserver(canvas, dimensionsState, inputState);

serviceManager.services.add(htmlElementResizeObserver);
serviceManager.services.add(mouseObserver);
serviceManager.services.add(MouseWheelObserver(canvas, eventBus, dimensionsState, inputState));
serviceManager.services.add(touchObserver);
serviceManager.services.add(PreventDefaultInput(canvas));

mainLoop.updatables.add(htmlElementResizeObserver);
mainLoop.updatables.add(mouseObserver);
mainLoop.updatables.add(touchObserver);
mainLoop.updatables.add(serviceManager);

// DOMRendererService receives messages from workers and other sources and
// redraws the DOM in the main thread.

const domRendererMessageChannel = new MessageChannel();
const domRendererService = DOMRendererService(domRendererMessageChannel.port1, uiRoot, renderDOMUIRouter);

mainLoop.updatables.add(domRendererService);
serviceManager.services.add(domRendererService);

// Workers can share a message channel if necessary. If there is no offscreen
// worker then the message channel can be used in the main thread. It is an
// overhead, but unifies how messages are handled in each case.

const quakeMapsMessageChannel = new MessageChannel();
const quakeMapsWorker = new Worker(workers.quakemaps.url, {
  credentials: "same-origin",
  name: workers.quakemaps.name,
  type: "module",
});

quakeMapsWorker.postMessage(
  {
    quakeMapsMessagePort: quakeMapsMessageChannel.port1,
  },
  [quakeMapsMessageChannel.port1]
);

// `createImageBitmap` has it's quirks and surprisingly no support in safari
// and ios. If it's not supported, then we have to use the main thread to
// generate textures and potentially send them into other workers.

const texturesMessageChannel = new MessageChannel();
const addTextureMessagePort = (function () {
  if ("function" === typeof window.createImageBitmap) {
    const texturesWorker = new Worker(workers.textures.url, {
      credentials: "same-origin",
      name: workers.textures.name,
      type: "module",
    });

    return function (messagePort: MessagePort) {
      texturesWorker.postMessage(
        {
          texturesMessagePort: messagePort,
        },
        [messagePort]
      );
    };
  } else {
    const textureCanvas = document.createElement("canvas");
    const textureCanvasContext2D = textureCanvas.getContext("2d");

    if (null === textureCanvasContext2D) {
      throw new Error("Unable to get detached canvas 2D context.");
    }

    const textureService = DOMTextureService(textureCanvas, textureCanvasContext2D);

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

addTextureMessagePort(atlasToTextureMessageChannel.port1);

const addAtlasMessagePort = (function () {
  if ("function" === typeof atlasCanvas.transferControlToOffscreen) {
    const offscreenAtlas = atlasCanvas.transferControlToOffscreen();
    const atlasWorker = new Worker(workers.atlas.url, {
      credentials: "same-origin",
      name: workers.atlas.name,
      type: "module",
    });

    atlasWorker.postMessage(
      {
        atlasCanvas: offscreenAtlas,
        texturesMessagePort: atlasToTextureMessageChannel.port2,
      },
      [atlasToTextureMessageChannel.port2, offscreenAtlas]
    );

    const atlasWorkerService = WorkerService(atlasWorker);

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
    const atlasCanvasContext2D = atlasCanvas.getContext("2d");

    if (null === atlasCanvasContext2D) {
      throw new Error("Unable to get atlas canvas 2D context.");
    }

    const atlasService = AtlasService(atlasCanvas, atlasCanvasContext2D, atlasToTextureMessageChannel.port2);

    mainLoop.updatables.add(atlasService);
    serviceManager.services.add(atlasService);

    return atlasService.registerMessagePort;
  }
})();

addAtlasMessagePort(atlasMessageChannel.port1);

// MD2 worker offloads model loading from the thread whether it's the main
// browser thread or the offscreen canvas thread. Loading MD2 models cause
// rendering to stutter.

const md2MessageChannel = new MessageChannel();
const md2Worker = new Worker(workers.md2.url, {
  credentials: "same-origin",
  name: workers.md2.name,
  type: "module",
});

md2Worker.postMessage(
  {
    md2MessagePort: md2MessageChannel.port1,
  },
  [md2MessageChannel.port1]
);

// If browser supports the offscreen canvas, then we can offload everything
// there. If not, then we continue in the main thread.

if ("function" === typeof canvas.transferControlToOffscreen) {
  const offscreenWorker = new Worker(workers.offscreen.url, {
    credentials: "same-origin",
    name: workers.offscreen.name,
    type: "module",
  });

  const offscreenCanvas = canvas.transferControlToOffscreen();
  const offscreenWorkerService = WorkerService(offscreenWorker, {
    dimensions: dimensionsState,
    input: inputState,
  });

  // prettier-ignore
  offscreenWorker.postMessage(
    {
      canvas: offscreenCanvas,
      devicePixelRatio: devicePixelRatio,
      atlasMessagePort: atlasMessageChannel.port2,
      domMessagePort: domRendererMessageChannel.port2,
      md2MessagePort: md2MessageChannel.port2,
      quakeMapsMessagePort: quakeMapsMessageChannel.port2,
      texturesMessagePort: texturesMessageChannel.port2,
    },
    [
      atlasMessageChannel.port2,
      domRendererMessageChannel.port2,
      md2MessageChannel.port2,
      offscreenCanvas,
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
  // this extra var is a hack to make esbuild leave the dynamic import as-is
  // https://github.com/evanw/esbuild/issues/56#issuecomment-643100248
  const filename = "/lib/bootstrap.js";

  import(filename).then(function ({ bootstrap }) {
    // prettier-ignore
    bootstrap(
      devicePixelRatio,
      eventBus,
      mainLoop,
      serviceManager,
      canvas,
      dimensionsState,
      inputState,
      logger,
      atlasMessageChannel.port2,
      domRendererMessageChannel.port2,
      md2MessageChannel.port2,
      quakeMapsMessageChannel.port2,
      texturesMessageChannel.port2,
    );
  });
}

mainLoop.start();
serviceManager.start();
