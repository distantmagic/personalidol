// @flow

/**
 * Note that if the parsing process fails, the DOMParser does not throw an
 * exception, but instead returns an error document.
 *
 * source: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */

import { default as XMLDocumentException } from "../classes/Exception/XMLDocument";

export function extractParseError(doc: Document): XMLDocumentException {
  const documentElement = doc.documentElement;

  if (!documentElement) {
    throw new XMLDocumentException("Missing documentElement in XML file.");
  }

  if ("parsererror" !== documentElement.nodeName) {
    throw new XMLDocumentException(
      "Expected 'parsererror' XML document, got something else."
    );
  }

  return new XMLDocumentException(documentElement.textContent);
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
    throw new XMLDocumentException(`Document is missing attribute: ${name}`);
  }

  return attr;
}

export function getNumberAttribute(
  element: HTMLElement,
  name: string,
  def?: number
): number {
  if ("number" === typeof def && !element.attributes.getNamedItem(name)) {
    return def;
  }

  const value = parseInt(getStringAttribute(element, name), 10);

  if (isNaN(value)) {
    throw new XMLDocumentException(
      `Document attribute is not numeric: "${name}"`
    );
  }

  return value;
}

export function getStringAttribute(element: HTMLElement, name: string): string {
  return getAttribute(element, name).value;
}
