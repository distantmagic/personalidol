import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { Preloadable } from "@personalidol/framework/src/Preloadable.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";
import type { UserSettings } from "@personalidol/framework/src/UserSettings.type";

import type { DOMElementsLookup } from "./DOMElementsLookup.type";
import type { DOMUIControllerState } from "./DOMUIControllerState.type";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

export interface DOMUIController<L extends DOMElementsLookup, U extends UserSettings> extends MainLoopUpdatable, Preloadable, RegistersMessagePort, Service {
  readonly state: DOMUIControllerState;

  dispose(message: MessageDOMUIDispose): void;

  render(message: MessageDOMUIRender<L>): void;
}
