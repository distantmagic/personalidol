import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import { createRouter } from "@personalidol/workers/src/createRouter";
import { createRPCLookupTable } from "@personalidol/workers/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/workers/src/handleRPCResponse";
import { notifyProgressManagerToExpectItems } from "@personalidol/loading-manager/src/notifyProgressManagerToExpectItems";
import { resetProgressManagerState } from "@personalidol/loading-manager/src/resetProgressManagerState";
import { sendRPCMessage } from "@personalidol/workers/src/sendRPCMessage";

import { uiStateOnly } from "./uiStateOnly";

import type { Logger } from "loglevel";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { FontPreloadMessage } from "@personalidol/dom-renderer/src/FontPreloadMessage.type";
import type { FontPreloadParameters } from "@personalidol/dom-renderer/src/FontPreloadParameters.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { RPCLookupTable } from "@personalidol/workers/src/RPCLookupTable.type";
import type { Scene as IScene } from "@personalidol/framework/src/Scene.interface";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";

const _fonts: ReadonlyArray<FontPreloadParameters> = Object.freeze([
  // Almendra

  // {
  //   family: "Almendra",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-bold.ttf`,
  //   descriptors: {
  //     weight: "700",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-bolditalic.ttf`,
  //   descriptors: {
  //     weight: "700",
  //     style: "italic",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-italic.ttf`,
  //   descriptors: {
  //     weight: "400",
  //     style: "italic",
  //   }
  // },
  {
    family: "Almendra",
    source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-regular.ttf`,
    descriptors: {
      weight: "400",
    },
  },

  // Mukta

  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-extrabold.ttf`,
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-extralight.ttf`,
  //   descriptors: {
  //     weight: "200",
  //   }
  // },
  {
    family: "Mukta",
    source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-light.ttf`,
    descriptors: {
      weight: "300",
    },
  },
  {
    family: "Mukta",
    source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-medium.ttf`,
    descriptors: {
      weight: "500",
    },
  },
  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-regular.ttf`,
  //   descriptors: {
  //     weight: "400",
  //   },
  // },
  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-semibold.ttf`,
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
]);

const _disposables: Set<DisposableCallback> = new Set();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _unmountables: Set<UnmountableCallback> = new Set();

const _fontMessageRouter = createRouter({
  preloadedFont: handleRPCResponse(_rpcLookupTable),
});

export function MainMenuScene(logger: Logger, domMessagePort: MessagePort, fontPreloadMessagePort: MessagePort, progressMessagePort: MessagePort): IScene {
  const state: MountState = Object.seal({
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

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    domMessagePort.postMessage(
      uiStateOnly({
        "pi-main-menu": {
          enabled: true,
          props: {},
        },
      })
    );
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    resetProgressManagerState(progressMessagePort);
    notifyProgressManagerToExpectItems(progressMessagePort, _fonts.length);

    await Promise.all(_fonts.map(_preloadFont));

    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function unmount(): void {
    state.isMounted = false;

    fontPreloadMessagePort.onmessage = null;

    fUnmount(_unmountables);
  }

  function update(delta: number): void {}

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
    id: MathUtils.generateUUID(),
    isScene: true,
    isView: false,
    name: `MainMenu`,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
