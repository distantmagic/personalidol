// @flow

import * as React from "react";
import classnames from "classnames";
import raf from "raf";

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

  React.useEffect(
    function() {
      if (!imageElement || isLoaded) {
        return;
      }

      function checkCompleted() {
        if (isLoaded) {
          return;
        }

        if (!imageElement.complete) {
          return void raf(checkCompleted);
        }

        notify();
      }

      raf(checkCompleted);
    },
    [imageElement, isLoaded, notify]
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
