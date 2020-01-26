import ElementSize from "src/framework/interfaces/ElementSize";

export default interface HTMLElementSize extends ElementSize<"px"> {
  readonly unit: "px";

  getHTMLElement(): HTMLElement;
}
