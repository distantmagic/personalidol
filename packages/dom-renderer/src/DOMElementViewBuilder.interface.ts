import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementView } from "./DOMElementView.interface";

export interface DOMElementViewBuilder<U extends UserSettings> {
  initialize(domElementView: DOMElementView<U>, domMessagePort: MessagePort): void;
}
