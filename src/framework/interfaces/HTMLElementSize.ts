import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type ElementSize from "src/framework/interfaces/ElementSize";

export default interface HTMLElementSize extends ElementSize<ElementPositionUnit.Px> {
  readonly unit: ElementPositionUnit.Px;

  getHTMLElement(): HTMLElement;
}
