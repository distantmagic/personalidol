// @flow

/**
 * Note that if the parsing process fails, the DOMParser does not throw an
 * exception, but instead returns an error document.
 *
 * source: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */

export function extractParseError(doc: Document): Error {
  const documentElement = doc.documentElement;

  if (!documentElement) {
    throw new Error("Missing documentElement in XML file.");
  }

  if ("parsererror" !== documentElement.nodeName) {
    throw new Error("Expected 'parsererror' XML document, got something else.");
  }

  return new Error(documentElement.textContent);
}

export function isParseError(doc: Document): boolean {
  const documentElement = doc.documentElement;

  if (!documentElement || "parsererror" === documentElement.nodeName) {
    return true;
  }

  return false;
}

export function getAttribute(element: HTMLElement, name: string): Attr {
  const attr = element.attributes.getNamedItem(name);

  if (!attr) {
    throw new Error(`Document is missing attribute: ${name}`);
  }

  return attr;
}

export function getNumberAttribute(element: HTMLElement, name: string): number {
  return parseInt(getStringAttribute(element, name), 10);
}

export function getStringAttribute(element: HTMLElement, name: string): string {
  return getAttribute(element, name).value;
}
