import ElementSize from "src/framework/interfaces/ElementSize";

export default interface HTMLElementSize extends ElementSize<"px"> {
  getHTMLElement(): HTMLElement;
}
