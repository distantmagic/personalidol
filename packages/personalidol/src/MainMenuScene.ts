import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { notifyLoadingManagerToExpectItems } from "@personalidol/loading-manager/src/notifyLoadingManagerToExpectItems";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

// import { MapScene } from "./MapScene";

import type { Logger } from "loglevel";

import type { DirectorState } from "@personalidol/loading-manager/src/DirectorState.type";
import type { Disposable } from "@personalidol/framework/src/Disposable.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { FontPreloadMessage } from "@personalidol/dom-renderer/src/FontPreloadMessage.type";
import type { FontPreloadParameters } from "@personalidol/dom-renderer/src/FontPreloadParameters.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { Unmountable } from "@personalidol/framework/src/Unmountable.type";

const _fonts: Array<FontPreloadParameters> = [
  // Almendra

  // {
  //   family: "Almendra",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-almendra-bold.ttf`,
  //   descriptors: {
  //     weight: "700",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-almendra-bolditalic.ttf`,
  //   descriptors: {
  //     weight: "700",
  //     style: "italic",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-almendra-italic.ttf`,
  //   descriptors: {
  //     weight: "400",
  //     style: "italic",
  //   }
  // },
  {
    family: "Almendra",
    source: `${__STATIC_BASE_PATH}/fonts/font-almendra-regular.ttf`,
    descriptors: {
      weight: "400",
    },
  },

  // Mukta

  // {
  //   family: "Mukta",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-mukta-extrabold.ttf`,
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
  // {
  //   family: "Mukta",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-mukta-extralight.ttf`,
  //   descriptors: {
  //     weight: "200",
  //   }
  // },
  {
    family: "Mukta",
    source: `${__STATIC_BASE_PATH}/fonts/font-mukta-light.ttf`,
    descriptors: {
      weight: "300",
    },
  },
  {
    family: "Mukta",
    source: `${__STATIC_BASE_PATH}/fonts/font-mukta-medium.ttf`,
    descriptors: {
      weight: "500",
    },
  },
  // {
  //   family: "Mukta",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-mukta-regular.ttf`,
  //   descriptors: {
  //     weight: "400",
  //   },
  // },
  // {
  //   family: "Mukta",
  //   source: `${__STATIC_BASE_PATH}/fonts/font-mukta-semibold.ttf`,
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
];

const _disposables: Set<Disposable> = new Set();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _unmountables: Set<Unmountable> = new Set();

const _fontMessageRouter = createRouter({
  preloadedFont: handleRPCResponse(_rpcLookupTable),
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
  md2MessagePort: MessagePort,
  progressMessagePort: MessagePort,
  quakeMapsMessagePort: MessagePort,
  texturesMessagePort: MessagePort
): IScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  function dispose(): void {
    state.isDisposed = true;

    fontPreloadMessagePort.onmessage = null;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    domMessagePort.postMessage({
      cMainMenu: {
        enabled: true,
        props: {},
      },
      // "uiOptions": {
      //   enabled: true,
      //   props: {},
      // },
    });
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    notifyLoadingManagerToExpectItems(progressMessagePort, _fonts.length);

    await Promise.all(_fonts.map(_preloadFont));

    state.isPreloading = false;
    state.isPreloaded = true;

    // setTimeout(function () {
    //   _loadMap("/maps/map-mountain-caravan.map");
    // }, 3000);
  }

  function unmount(): void {
    state.isMounted = false;

    fUnmount(_unmountables);
  }

  function update(delta: number): void {}

  // function _loadMap(filename: string): void {
  //   // prettier-ignore
  //   directorState.next = MapScene(
  //     logger,
  //     effectComposer,
  //     directorState,
  //     eventBus,
  //     dimensionsState,
  //     inputState,
  //     domMessagePort,
  //     md2MessagePort,
  //     progressMessagePort,
  //     quakeMapsMessagePort,
  //     texturesMessagePort,
  //     filename,
  //   );
  // }

  async function _preloadFont(fontParameters: FontPreloadParameters) {
    const fontPreloadMessage: FontPreloadMessage = {
      preloadFont: {
        ...fontParameters,
        rpc: MathUtils.generateUUID(),
      },
    };

    await sendRPCMessage(_rpcLookupTable, fontPreloadMessagePort, fontPreloadMessage);
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
