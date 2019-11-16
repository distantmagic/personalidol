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

  const notify = React.useCallback(
    function() {
      if (isLoaded) {
        return;
      }

      setIsLoaded(true);
      props.onLoad(props.src);
    },
    [isLoaded, props]
  );

  const checkCompleted = React.useCallback(
    function () {
      if (isLoaded || !imageElement) {
        return;
      }

      if (!imageElement.complete) {
        return void setTimeout(checkCompleted);
      }

      notify();
    },
    [imageElement, isLoaded, notify]
  );

  React.useEffect(
    function() {
      if (!imageElement || isLoaded) {
        return;
      }

      const timeoutId = setTimeout(checkCompleted);

      return function () {
        clearTimeout(timeoutId);
      };
    },
    [checkCompleted, imageElement, isLoaded, notify]
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
