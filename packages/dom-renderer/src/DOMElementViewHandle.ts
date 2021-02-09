import { MathUtils } from "three/src/math/MathUtils";

// import type { DOMElementProps } from "./DOMElementProps.type";
import type { DOMElementViewHandle as IDOMElementViewHandle } from "./DOMElementViewHandle.interface";
import type { MessageDOMUIDispose } from "./MessageDOMUIDispose.type";
import type { MessageDOMUIRender } from "./MessageDOMUIRender.type";

export function DOMElementViewHandle(domMessagePort: MessagePort, elementName: string): IDOMElementViewHandle {
  let _domElementId: null | string = null;

  function enable(isEnabled: boolean) {
    if (Boolean(_domElementId) === isEnabled) {
      return;
    }

    if (_domElementId && !isEnabled) {
      domMessagePort.postMessage({
        dispose: <MessageDOMUIDispose>[_domElementId],
      });
      _domElementId = null;

      return;
    }

    if (!_domElementId) {
      _domElementId = MathUtils.generateUUID();
    }

    domMessagePort.postMessage({
      render: <MessageDOMUIRender>{
        element: elementName,
        id: _domElementId,
        props: {},
      },
    });
  }

  return Object.freeze({
    enable: enable,
  });
}
