import { StatsReporterDOMElementView } from "./StatsReporterDOMElementView";

import type { Logger } from "loglevel";

import type { DOMElementRenderingContext } from "./DOMElementRenderingContext.interface";
import type { DOMElementRenderingContextResolver as IDOMElementRenderingContextResolver } from "./DOMElementRenderingContextResolver.interface";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

export function DOMElementRenderingContextResolver(): IDOMElementRenderingContextResolver {
  function resolve(logger: Logger, message: MessageDOMUIRender, domMessagePort: MessagePort, uiMessagePort: MessagePort, shadow: ShadowRoot): DOMElementRenderingContext {
    switch (message.element) {
      case "pi-stats-reporter":
        return StatsReporterDOMElementView(message.id, shadow);
    }

    throw new Error(`Unsupported dom view: "${message.element}"`);
  }

  return Object.freeze({
    resolve: resolve,
  });
}
