// @flow

/**
 * Note that if the parsing process fails, the DOMParser does not throw an
 * exception, but instead returns an error document.
 *
 * source: https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */

import { default as XMLDocumentException } from "../classes/Exception/XMLDocument";

import type { LoggerBreadcrumbs } from "../interfaces/LoggerBreadcrumbs";

export function extractParseError(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  doc: Document
): XMLDocumentException {
  const documentElement = doc.documentElement;

  if (!documentElement) {
    throw new XMLDocumentException(
      loggerBreadcrumbs,
      "Missing documentElement in XML file."
    );
  }

  if ("parsererror" !== documentElement.nodeName) {
    throw new XMLDocumentException(
      loggerBreadcrumbs,
      "Expected 'parsererror' XML document, got something else."
    );
  }

  return new XMLDocumentException(
    loggerBreadcrumbs,
    documentElement.textContent
  );
}

export function isParseError(doc: Document): boolean {
  const documentElement = doc.documentElement;

  if (!documentElement || "parsererror" === documentElement.nodeName) {
    return true;
  }

  return false;
}

export function getAttribute(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  name: string
): Attr {
  const attr = element.attributes.getNamedItem(name);

  if (!attr) {
    throw new XMLDocumentException(
      loggerBreadcrumbs,
      `Document is missing attribute: ${name}`
    );
  }

  return attr;
}

export function getElementWithAttributes(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  name: string,
  attributes: {
    [string]: string,
  }
): ?HTMLElement {
  const foundElements = element.getElementsByTagName(name);

  for (
    let i = 0;
    i < foundElements.length;
    i += 1
  ) {
    const foundElement = foundElements.item(i);

    if (foundElement && hasAllAttributes(loggerBreadcrumbs, foundElement, attributes)) {
      return foundElement;
    }
  }
}

export function getNumberAttribute(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  name: string,
  def?: number
): number {
  if ("number" === typeof def && !element.attributes.getNamedItem(name)) {
    return def;
  }

  const value = parseInt(
    getStringAttribute(loggerBreadcrumbs, element, name),
    10
  );

  if (isNaN(value)) {
    throw new XMLDocumentException(
      loggerBreadcrumbs,
      `Document attribute is not numeric: "${name}"`
    );
  }

  return value;
}

export function getStringAttribute(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  name: string
): string {
  return getAttribute(loggerBreadcrumbs, element, name).value;
}

export function hasAllAttributes(
  loggerBreadcrumbs: LoggerBreadcrumbs,
  element: HTMLElement,
  attributes: {
    [string]: string,
  }
) {
  for (let attributeName of Object.keys(attributes)) {
    const attribute = element.attributes.getNamedItem(attributeName);
    if (!attribute || attribute.value !== attributes[attributeName]) {
      return false;
    }
  }

  return true;
}
