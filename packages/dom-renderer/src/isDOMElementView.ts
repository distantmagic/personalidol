import { DOMElementView } from "./DOMElementView";

import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementView as IDOMElementView } from "./DOMElementView.interface";

export function isDOMElementView<U extends UserSettings>(item: HTMLElement): item is IDOMElementView<U> {
  return item instanceof DOMElementView;
}
