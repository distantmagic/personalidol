export function clearHTMLElement(htmlElement: HTMLElement): void {
  while (htmlElement.lastChild) {
    htmlElement.removeChild(htmlElement.lastChild);
  }
}
