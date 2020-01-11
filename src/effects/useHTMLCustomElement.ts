// @flow strict

import * as React from "react";

export default function useHTMLCustomElement(name: string, ElementConstructor: any): boolean {
  const [isElementDefined, setIsElementDefined] = React.useState<boolean>(false);
  const customElements = window.customElements;

  React.useEffect(
    function() {
      if (customElements) {
        customElements.whenDefined(name).then(function() {
          setIsElementDefined(true);
        });
        if (!customElements.get(name)) {
          customElements.define(name, ElementConstructor);
        }
      }
    },
    [customElements, name, ElementConstructor]
  );

  return isElementDefined;
}
