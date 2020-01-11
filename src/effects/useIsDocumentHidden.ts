import * as React from "react";

export default function useIsDocumentHidden(): boolean {
  const [isDocumentHidden, setIsDocumentHidden] = React.useState<boolean>(document.hidden);

  React.useEffect(
    function() {
      function onVisibilityChange() {
        setIsDocumentHidden(document.hidden);
      }

      document.addEventListener("visibilitychange", onVisibilityChange, {
        once: true,
      });

      return function() {
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    },
    [isDocumentHidden]
  );

  return isDocumentHidden;
}
