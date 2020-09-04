export function getSVGElementById(documentElement: Document | ShadowRoot, id: string): SVGElement {
  const element = documentElement.getElementById(id);

  if (!element) {
    throw new Error(`Element does not exist: "#${id}"`);
  }

  if (!(element instanceof SVGElement)) {
    throw new Error(`Element is not an SVG element: "#${id}"`);
  }

  return element;
}
