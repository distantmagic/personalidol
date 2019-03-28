// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";

import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
  sceneManager: SceneManagerInterface
|};

export default function HudSceneLocationComplexCanvas(props: Props) {
  const threeCanvasRef = React.useRef(null);
  const [cancelToken] = React.useState(new CancelToken());

  React.useEffect(
    function() {
      const element = threeCanvasRef.current;

      if (element) {
        props.sceneManager.attach(element);
      }
    },
    [threeCanvasRef]
  );

  React.useEffect(
    function() {
      props.sceneManager.loop(cancelToken);

      return function() {
        cancelToken.cancel();
      };
    },
    [cancelToken, props.sceneManager]
  );

  return <canvas ref={threeCanvasRef} />;
}
