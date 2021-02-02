import type { Logger } from "loglevel";

import { FatalErrorDOMElementView } from "./FatalErrorDOMElementView";
import { LoadingScreenDOMElementView } from "./LoadingScreenDOMElementView";
import { MainMenuDOMElementView } from "./MainMenuDOMElementView";
import { ObjectLabelDOMElementView } from "./ObjectLabelDOMElementView";

import type { DOMElementRenderingContext } from "@personalidol/dom-renderer/src/DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextResolver as IDOMElementRenderingContextResolver } from "@personalidol/dom-renderer/src/DOMElementRenderingContextResolver.interface";
import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";

export function DOMElementRenderingContextResolver(chainedResolver: IDOMElementRenderingContextResolver): IDOMElementRenderingContextResolver {
  function resolve(logger: Logger, message: MessageDOMUIRender, domMessagePort: MessagePort, uiMessagePort: MessagePort, shadow: ShadowRoot): DOMElementRenderingContext {
    switch (message.element) {
      case "pi-fatal-error":
        return FatalErrorDOMElementView(message.id, shadow);
      case "pi-loading-screen":
        return LoadingScreenDOMElementView(message.id, shadow);
      case "pi-main-menu":
        return MainMenuDOMElementView(message.id, shadow, uiMessagePort);
      case "pi-object-label":
        return ObjectLabelDOMElementView(message.id, shadow, uiMessagePort);
    }

    return chainedResolver.resolve(logger, message, domMessagePort, uiMessagePort, shadow);
  }

  return Object.freeze({
    resolve: resolve,
  });
}
