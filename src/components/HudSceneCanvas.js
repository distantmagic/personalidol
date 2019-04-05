// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";

import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
  sceneManager: SceneManagerInterface
|};

export default function HudSceneCanvas(props: Props) {
  const [threeCanvas, setThreeCanvas] = React.useState(null);

  React.useEffect(
    function() {
      if (!threeCanvas) {
        return;
      }

      const sceneManager = props.sceneManager;

      sceneManager.attach(threeCanvas);

      return function() {
        sceneManager.detach();
      };
    },
    [props.sceneManager, threeCanvas]
  );

  React.useEffect(
    function() {
      const cancelToken = new CancelToken();

      props.sceneManager.loop(cancelToken);

      return function() {
        cancelToken.cancel();
      };
    },
    [props.sceneManager]
  );

  return <canvas ref={setThreeCanvas} />;
}
