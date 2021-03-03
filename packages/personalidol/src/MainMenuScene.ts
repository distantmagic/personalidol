import { MathUtils } from "three/src/math/MathUtils";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { Scene } from "three/src/scenes/Scene";

import { disposeAll } from "@personalidol/framework/src/disposeAll";
import { unmountAll } from "@personalidol/framework/src/unmountAll";

import { createRouter } from "@personalidol/framework/src/createRouter";
import { createRPCLookupTable } from "@personalidol/framework/src/createRPCLookupTable";
import { handleRPCResponse } from "@personalidol/framework/src/handleRPCResponse";
import { RenderPass } from "@personalidol/three-modules/src/postprocessing/RenderPass";
import { sendRPCMessage } from "@personalidol/framework/src/sendRPCMessage";
import { unmountPass } from "@personalidol/three-modules/src/unmountPass";

import type { Logger } from "loglevel";

import type { DisposableCallback } from "@personalidol/framework/src/DisposableCallback.type";
import type { EffectComposer } from "@personalidol/three-modules/src/postprocessing/EffectComposer.interface";
import type { FontPreloadParameters } from "@personalidol/dom-renderer/src/FontPreloadParameters.type";
import type { MessageDOMUIDispose } from "@personalidol/dom-renderer/src/MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";
import type { MessageFontPreload } from "@personalidol/dom-renderer/src/MessageFontPreload.type";
import type { RPCLookupTable } from "@personalidol/framework/src/RPCLookupTable.type";
import type { SceneState } from "@personalidol/framework/src/SceneState.type";
import type { UnmountableCallback } from "@personalidol/framework/src/UnmountableCallback.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { MainMenuScene as IMainMenuScene } from "./MainMenuScene.interface";

const _fonts: ReadonlyArray<FontPreloadParameters> = Object.freeze([
  // Almendra

  // {
  //   family: "Almendra",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-bold.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "700",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-bolditalic.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "700",
  //     style: "italic",
  //   }
  // },
  // {
  //   family: "Almendra",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-italic.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "400",
  //     style: "italic",
  //   }
  // },
  {
    family: "Almendra",
    source: `${__ASSETS_BASE_PATH}/fonts/font-almendra-regular.ttf?${__CACHE_BUST}`,
    descriptors: {
      weight: "400",
    },
  },

  // Mukta

  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-extrabold.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-extralight.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "200",
  //   }
  // },
  {
    family: "Mukta",
    source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-light.ttf?${__CACHE_BUST}`,
    descriptors: {
      weight: "300",
    },
  },
  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-regular.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "400",
  //   },
  // },
  {
    family: "Mukta",
    source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-medium.ttf?${__CACHE_BUST}`,
    descriptors: {
      weight: "500",
    },
  },
  // {
  //   family: "Mukta",
  //   source: `${__ASSETS_BASE_PATH}/fonts/font-mukta-semibold.ttf?${__CACHE_BUST}`,
  //   descriptors: {
  //     weight: "800",
  //   }
  // },
]);

const _disposables: Set<DisposableCallback> = new Set();
const _rpcLookupTable: RPCLookupTable = createRPCLookupTable();
const _unmountables: Set<UnmountableCallback> = new Set();

const _camera = new PerspectiveCamera();
const _scene = new Scene();

const _fontMessageRouter = createRouter({
  preloadedFont: handleRPCResponse(_rpcLookupTable),
});

let _fontsPreloaded: boolean = false;

export function MainMenuScene(
  logger: Logger,
  effectComposer: EffectComposer,
  domMessagePort: MessagePort,
  fontPreloadMessagePort: MessagePort,
  progressMessagePort: MessagePort
): IMainMenuScene {
  const state: SceneState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPaused: false,
    isPreloaded: false,
    isPreloading: false,
    needsUpdates: true,
  });

  const _domMainMenuElementId: string = MathUtils.generateUUID();

  function _onFontsPreloaded(): void {
    _fontsPreloaded = true;
    state.isPreloading = false;
    state.isPreloaded = true;
  }

  function dispose(): void {
    state.isDisposed = true;

    disposeAll(_disposables);
  }

  function mount(): void {
    state.isMounted = true;

    const renderPass = new RenderPass(_scene, _camera);

    effectComposer.addPass(renderPass);
    _unmountables.add(unmountPass(effectComposer, renderPass));

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    domMessagePort.postMessage({
      render: <MessageDOMUIRender<DOMElementsLookup>>{
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

  function pause(): void {
    state.isPaused = true;
  }

  function preload(): void {
    if (_fontsPreloaded) {
      state.isPreloading = false;
      state.isPreloaded = true;

      return;
    }

    state.isPreloading = true;

    fontPreloadMessagePort.onmessage = _fontMessageRouter;

    progressMessagePort.postMessage({
      reset: true,
    });

    Promise.all(_fonts.map(_preloadFont)).then(_onFontsPreloaded);
  }

  function unmount(): void {
    state.isMounted = false;

    fontPreloadMessagePort.onmessage = null;

    unmountAll(_unmountables);
  }

  function unpause(): void {
    state.isPaused = false;
  }

  function update(delta: number): void {
    effectComposer.render(delta);
  }

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
    isMainMenuScene: true,
    isScene: true,
    name: `MainMenu`,
    state: state,

    dispose: dispose,
    mount: mount,
    pause: pause,
    preload: preload,
    unmount: unmount,
    unpause: unpause,
    update: update,
  });
}
