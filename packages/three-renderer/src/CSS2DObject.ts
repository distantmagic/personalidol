import { Object3D } from "three/src/core/Object3D";

import { isSharedArrayBufferSupported } from "@personalidol/support/src/isSharedArrayBufferSupported";

import { CSS2DObjectState } from "./CSS2DObjectState";
import { isCSS2DObject } from "./isCSS2DObject";

import type { DOMElementProps } from "@personalidol/dom-renderer/src/DOMElementProps.type";
import type { MessageDOMUIDispose } from "@personalidol/dom-renderer/src/MessageDOMUIDispose.type";

import type { CSS2DObject as ICSS2DObject } from "./CSS2DObject.interface";

const useSharedArrayBuffer: boolean = isSharedArrayBufferSupported();

export class CSS2DObject extends Object3D implements ICSS2DObject {
  public readonly element: string;
  public readonly state: Float32Array = CSS2DObjectState.createEmptyState(useSharedArrayBuffer);
  public readonly type: "CSS2DObject" = "CSS2DObject";

  public isDirty: boolean = false;
  public isDisposed: boolean = false;
  public isRendered: boolean = false;
  public props: DOMElementProps;

  constructor(domMessagePort: MessagePort, element: string, props: DOMElementProps) {
    super();

    let self: ICSS2DObject = this;

    this.element = element;
    this.props = props;

    this.addEventListener("removed", function () {
      const disposables: Array<string> = [];

      self.traverse(function (object: Object3D) {
        if (!isCSS2DObject(object)) {
          return;
        }

        if (object.isDisposed) {
          throw new Error(`CSS2DObject is already disposed: "${object.uuid}"`);
        }

        if (!object.isRendered) {
          return;
        }

        object.isDisposed = true;
        disposables.push(object.uuid);
      });

      domMessagePort.postMessage({
        dispose: <MessageDOMUIDispose>disposables,
      });
    });
  }
}
