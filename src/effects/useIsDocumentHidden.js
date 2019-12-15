// @flow

import * as React from "react";

export default function useIsDocumentHidden(): boolean {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState<boolean>(document.hidden);

  React.useEffect(
    function() {
      const intervalId = setInterval(function() {
        // I know that 'document.onvisibilitychange' event handler exists, but
        // sometimes it does not trigger or just produces incorrect state when
        // document visibility is changed quickly, so using interval is safer
        // and eliminates some edge cases.
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
