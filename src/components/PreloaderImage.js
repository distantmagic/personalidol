// @flow

import * as React from "react";
import classnames from "classnames";

type Props = {|
  onLoad: (src: string) => any,
  src: string,
|};

export default React.memo<Props>(function PreloaderImage(props: Props) {
  const [imageElement, setImageElement] = React.useState<?HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [isArtificiallyLoaded, setIsArtificiallyLoaded] = React.useState<boolean>(false);
  const [isNotified, setIsNotified] = React.useState<boolean>(false);

  const checkCompleted = React.useCallback(
    function() {
      if (isLoaded || !imageElement) {
        return;
      }

      if (!imageElement.complete) {
        return void setTimeout(checkCompleted);
      }

      setIsLoaded(true);
    },
    [imageElement, isLoaded]
  );

  React.useEffect(
    function() {
      if (!imageElement || isLoaded) {
        return;
      }

      const timeoutId = setTimeout(checkCompleted);

      return function() {
        clearTimeout(timeoutId);
      };
    },
    [checkCompleted, imageElement, isLoaded]
  );

  React.useEffect(
    function() {
      if (isArtificiallyLoaded) {
        return;
      }

      function onComplete() {
        setIsArtificiallyLoaded(true);
      }

      const img = new Image();

      img.onerror = onComplete;
      img.onload = onComplete;
      img.src = props.src;

      return function() {
        delete img.onload;
      };
    },
    [isArtificiallyLoaded, props]
  );

  React.useEffect(
    function() {
      if (!isLoaded || !isArtificiallyLoaded || isNotified) {
        return;
      }

      setIsNotified(true);
      props.onLoad(props.src);
    },
    [isArtificiallyLoaded, isLoaded, isNotified, props]
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
