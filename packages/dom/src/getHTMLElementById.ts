export function getHTMLElementById(documentElement: Document | ShadowRoot, id: string): HTMLElement {
  const element = documentElement.getElementById(id);

  if (!element) {
    throw new Error(`Element does not exist: "#${id}"`);
  }

  return element;
}
