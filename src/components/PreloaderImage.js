// @flow

import * as React from "react";
import classnames from "classnames";

type Props = {|
  onLoad: (src: string) => void,
  src: string,
|};

export default React.memo<Props>(function PreloaderImage(props: Props) {
  const [imageElement, setImageElement] = React.useState<?HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [isNotified, setIsNotified] = React.useState<boolean>(false);

  const checkCompleted = React.useCallback(
    function() {
      if (isLoaded || !imageElement || !imageElement.complete) {
        return false;
      }

      setIsLoaded(true);

      return true;
    },
    [imageElement, isLoaded]
  );

  React.useEffect(
    function() {
      if (!imageElement || isLoaded) {
        return;
      }

      let timeoutId;

      function doCheckCompleted() {
        if (!checkCompleted()) {
          timeoutId = setTimeout(doCheckCompleted);
        }
      }
      doCheckCompleted();

      return function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    },
    [checkCompleted, imageElement, isLoaded]
  );

  React.useEffect(
    function() {
      if (!isLoaded || isNotified) {
        return;
      }

      setIsNotified(true);
      props.onLoad(props.src);
    },
    [isLoaded, isNotified, props]
  );

  return (
    <img
      alt=""
      className={classnames("dd__preloader__progress__image", {
        "dd__preloader__progress__image--loaded": isLoaded,
        "dd__preloader__progress__image--loading": !isLoaded,
      })}
      key={props.src}
      ref={setImageElement}
      src={props.src}
    />
  );
});
