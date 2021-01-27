import { MathUtils } from "three/src/math/MathUtils";

import { dispose as fDispose } from "@personalidol/framework/src/dispose";
import { unmount as fUnmount } from "@personalidol/framework/src/unmount";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createRPCLookupTable } from "@personalidol/framework/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/framework/src/handleRPCResponse";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";

import type { Logger } from "loglevel";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { FontPreloadParameters } from "@personalidol/dom-renderer/src/FontPreloadParameters.type";
import type { MessageDOMUIDispose } from "@personalidol/dom-renderer/src/MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";
import type { MessageFontPreload } from "@personalidol/dom-renderer/src/MessageFontPreload.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
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

  const _domMainMenuElementId: string = MathUtils.generateUUID();

  function dispose(): void {
    state.isDisposed = true;

    fDispose(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    domMessagePort.postMessage({
      render: <MessageDOMUIRender>{
        id: _domMainMenuElementId,
        element: "pi-main-menu",
        props: {},
      },
    });

    _unmountables.add(function () {
      domMessagePort.postMessage({
        dispose: <MessageDOMUIDispose>[_domMainMenuElementId],
      });
    });
  }

  async function preload(): Promise<void> {
    state.isPreloading = true;

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    progressMessagePort.postMessage({
      reset: true,
    });

    progressMessagePort.postMessage({
      expectAtLeast: _fonts.length,
    });

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
    await sendRPCMessage(_rpcLookupTable, fontPreloadMessagePort, <MessageFontPreload>{
      preloadFont: {
        ...fontParameters,
        rpc: MathUtils.generateUUID(),
      },
    });
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
