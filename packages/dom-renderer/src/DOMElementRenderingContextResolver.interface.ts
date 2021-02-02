import type { Logger } from "loglevel";

import type { DOMElementRenderingContext } from "./DOMElementRenderingContext.interface";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

export interface DOMElementRenderingContextResolver {
  resolve(logger: Logger, message: MessageDOMUIRender, domMessagePort: MessagePort, uiMessagePort: MessagePort, shadow: ShadowRoot): DOMElementRenderingContext;
}
