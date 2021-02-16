export function isHTMLElementConstructor(item: any): item is typeof HTMLElement {
  if ("function" !== typeof item) {
    return false;
  }

  return item.prototype instanceof HTMLElement;
}
