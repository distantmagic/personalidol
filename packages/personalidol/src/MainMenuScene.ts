import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { notifyLoadingManagerToExpectItems } from "@personalidol/loading-manager/src/notifyLoadingManagerToExpectItems";
import { resetLoadingManagerState } from "@personalidol/loading-manager/src/resetLoadingManagerState";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import type { Logger } from "loglevel";

import type { ClearRoutesMessage } from "@personalidol/dom-renderer/src/ClearRoutesMessage.type";
import type { DirectorState } from "@personalidol/framework/src/DirectorState.type";
import type { Disposable } from "@personalidol/framework/src/Disposable.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { EventBus } from "@personalidol/framework/src/EventBus.interface";
import type { FontPreloadParameters } from "@personalidol/dom-renderer/src/FontPreloadParameters.type";
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
  // {
  //   family: "Mukta",
  //   source: "/fonts/font-mukta-light.ttf",
  //   descriptors: {
  //     weight: "300",
  //   }
  // },
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

const _disposables: Set<Disposable> = new Set();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _unmountables: Set<Unmountable> = new Set();

// "/maps/map-mountain-caravan.map"

const _clearRoutesMessage: ClearRoutesMessage & RenderRoutesMessage = {
  clear: ["/main-menu"],
  render: {},
};

const _fontMessageRouter = createRouter({
  preloaded: handleRPCResponse(_rpcLookupTable),
});

export function MainMenuScene(
  logger: Logger,
  effectComposer: EffectComposer,
  directorState: DirectorState,
  eventBus: EventBus,
  dimensionsState: Uint32Array,
  inputState: Int32Array,
  domMessagePort: MessagePort,
  fontPreloaderMessagePort: MessagePort,
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

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    domMessagePort.postMessage({
      render: {
        "/main-menu": {},
      },
    });
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    fontPreloaderMessagePort.onmessage = _fontMessageRouter;

    notifyLoadingManagerToExpectItems(progressMessagePort, _fonts.length);

    await Promise.all(_fonts.map(_preloadFont));

    state.isPreloading = false;
    state.isPreloaded = true;

    resetLoadingManagerState(progressMessagePort);
  }

  function unmount(): void {
    state.isMounted = false;

    domMessagePort.postMessage(_clearRoutesMessage);

    fUnmount(_unmountables);
  }

  function update(delta: number): void {}

  async function _preloadFont(fontParameters: FontPreloadParameters) {
    await sendRPCMessage(_rpcLookupTable, fontPreloaderMessagePort, {
      preload: {
        ...fontParameters,
        rpc: MathUtils.generateUUID(),
      },
    });
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
