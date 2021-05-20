import type { i18n } from "i18next";

import type { DOMElementView } from "./DOMElementView.interface";
import type { DOMElementViewContext } from "./DOMElementViewContext.type";

export interface DOMElementViewBuilder<C extends DOMElementViewContext> {
  initialize(domElementView: DOMElementView<C>, domMessagePort: MessagePort, i18next: i18n): void;
}
