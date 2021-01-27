import type { MainLoopUpdatable } from "@personalidol/framework/src/MainLoopUpdatable.interface";
import type { RegistersMessagePort } from "@personalidol/framework/src/RegistersMessagePort.interface";
import type { Service } from "@personalidol/framework/src/Service.interface";

import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

export interface DOMUIController extends MainLoopUpdatable, RegistersMessagePort, Service {
  dispose(message: MessageDOMUIDispose): void;

  render(message: MessageDOMUIRender): void;
}
