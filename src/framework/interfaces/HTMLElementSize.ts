import { ElementSize } from "src/framework/interfaces/ElementSize";

export interface HTMLElementSize extends ElementSize<"px"> {
  getHTMLElement(): HTMLElement;
}
