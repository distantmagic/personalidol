// @flow

import * as React from "react";

export default function useIsDocumentHidden(): boolean {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState<boolean>(document.hidden);

  React.useEffect(
    function() {
      const intervalId = setInterval(function() {
        setIsDocumentHidden(document.hidden);
      }, 100);

      return function() {
        clearInterval(intervalId);
      };
    },
    [isDocumentHidden]
  );

  return isDocumentHidden;
}
