import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { notifyLoadingManagerToExpectItems } from "@personalidol/loading-manager/src/notifyLoadingManagerToExpectItems";
import { resetLoadingManagerState } from "@personalidol/loading-manager/src/resetLoadingManagerState";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { ClearRoutesMessage } from "@personalidol/dom-renderer/src/ClearRoutesMessage.type";
import type { DirectorState } from "@personalidol/framework/src/DirectorState.type";
import type { Disposable } from "@personalidol/framework/src/Disposable.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { FontPreloadMessage } from "@personalidol/dom-renderer/src/FontPreloadMessage.type";
import type { FontPreloadParameters } from "@personalidol/dom-renderer/src/FontPreloadParameters.type";
import type { ImagePreloadMessage } from "@personalidol/dom-renderer/src/ImagePreloadMessage.type";
import type { ImagePreloadParameters } from "@personalidol/dom-renderer/src/ImagePreloadParameters.type";
import type { RenderRoutesMessage } from "@personalidol/dom-renderer/src/RenderRoutesMessage.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { Unmountable } from "@personalidol/framework/src/Unmountable.type";

const _fonts: Array<FontPreloadParameters> = [
  // Almendra

  // {
  //   family: "Almendra",
  //   source: "/fonts/font-almendra-bold.ttf",
  //   descriptors: {
  //     weight: "700",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: "/fonts/font-almendra-bolditalic.ttf",
  //   descriptors: {
  //     weight: "700",
  //     style: "italic",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: "/fonts/font-almendra-italic.ttf",
  //   descriptors: {
  //     weight: "400",
  //     style: "italic",
  //   }
  // },
  {
    family: "Almendra",
    source: "/fonts/font-almendra-regular.ttf",
    descriptors: {
      weight: "400",
    },
  },

  // Mukta

  // {
  //   family: "Mukta",
  //   source: "/fonts/font-mukta-extrabold.ttf",
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
  // {
  //   family: "Mukta",
  //   source: "/fonts/font-mukta-extralight.ttf",
  //   descriptors: {
  //     weight: "200",
  //   }
  // },
  {
    family: "Mukta",
    source: "/fonts/font-mukta-light.ttf",
    descriptors: {
      weight: "300",
    },
  },
  // {
  //   family: "Mukta",
  //   source: "/fonts/font-mukta-medium.ttf",
  //   descriptors: {
  //     weight: "500",
  //   }
  // },
  {
    family: "Mukta",
    source: "/fonts/font-mukta-regular.ttf",
    descriptors: {
      weight: "400",
    },
  },
  // {
  //   family: "Mukta",
  //   source: "/fonts/font-mukta-semibold.ttf",
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
];

const _images: Array<ImagePreloadParameters> = [
  {
    url: "/assets/texture-mineshaft-marble-512.png",
    css: `
      .main-menu {
        background-image: url({dataurl});
      }
    `,
  },
  {
    url: "/assets/image-rise-and-fall.png",
    css: `
      .main-menu:before {
        background-image: url({dataurl});
      }
    `,
  },
];

const _disposables: Set<Disposable> = new Set();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _unmountables: Set<Unmountable> = new Set();

const _clearRoutesMessage: ClearRoutesMessage & RenderRoutesMessage = {
  clear: ["/main-menu"],
  render: {},
};

const _fontMessageRouter = createRouter({
  preloadedFont: handleRPCResponse(_rpcLookupTable),
});

const _imageMessageRouter = createRouter({
  preloadedImage: handleRPCResponse(_rpcLookupTable),
});

export function MainMenuScene(
  logger: Logger,
  effectComposer: EffectComposer,
  directorState: DirectorState,
  eventBus: EventBus,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  imagePreloadMessagePort: MessagePort,
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort,
  uiMessagePort: MessagePort
): IScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  const _uiMessageRouter = createRouter({
    navigateToMap({ filename }: { filename: string }) {
      _loadMap(filename);
    },
  });

  function dispose(): void {
    state.isDisposed = true;

    fontPreloadMessagePort.onmessage = null;
    imagePreloadMessagePort.onmessage = null;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    uiMessagePort.onmessage = _uiMessageRouter;
    domMessagePort.postMessage({
      render: {
        "/main-menu": {},
      },
    });
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    fontPreloadMessagePort.onmessage = _fontMessageRouter;
    imagePreloadMessagePort.onmessage = _imageMessageRouter;

    notifyLoadingManagerToExpectItems(progressMessagePort, _fonts.length + _images.length);

    const preloadFonts = _fonts.map(_preloadFont);
    const preloadImages = _images.map(_preloadImage);

    await Promise.all(preloadFonts.concat(preloadImages));

    state.isPreloading = false;
    state.isPreloaded = true;

    resetLoadingManagerState(progressMessagePort);

    // setTimeout(function () {
    //   _loadMap("/maps/map-mountain-caravan.map");
    // }, 3000);
  }

  function unmount(): void {
    state.isMounted = false;

    domMessagePort.postMessage(_clearRoutesMessage);
    uiMessagePort.onmessage = null;

    fUnmount(_unmountables);
  }

  function update(delta: number): void {}

  function _loadMap(filename: string): void {
    // prettier-ignore
    directorState.next = MapScene(
      logger,
      effectComposer,
      directorState,
      eventBus,
      dimensionsState,
      inputState,
      domMessagePort,
      md2MessagePort,
      progressMessagePort,
      quakeMapsMessagePort,
      texturesMessagePort,
      filename,
    );
  }

  async function _preloadFont(fontParameters: FontPreloadParameters) {
    const fontPreloadMessage: FontPreloadMessage = {
      preloadFont: {
        ...fontParameters,
        rpc: MathUtils.generateUUID(),
      },
    };

    await sendRPCMessage(_rpcLookupTable, fontPreloadMessagePort, fontPreloadMessage);
  }

  async function _preloadImage(imageParamteres: ImagePreloadParameters) {
    const imagePreloadMessage: ImagePreloadMessage = {
      preloadImage: {
        ...imageParamteres,
        rpc: MathUtils.generateUUID(),
      },
    };

    await sendRPCMessage(_rpcLookupTable, imagePreloadMessagePort, imagePreloadMessage);
  }

  return Object.freeze({
    name: `MainMenu`,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
