// @flow

import * as React from "react";
import classnames from "classnames";

import CancelToken from "../framework/classes/CancelToken";

import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
  resourcesLoadingState: ResourcesLoadingState,
  sceneManager: SceneManagerInterface
|};

export default function HudSceneCanvas(props: Props) {
  const [threeCanvas, setThreeCanvas] = React.useState(null);

  React.useEffect(
    function() {
      if (!threeCanvas) {
        return;
      }

      const cancelToken = new CancelToken();
      const sceneManager = props.sceneManager;

      sceneManager.attach(threeCanvas).then(function() {
        sceneManager.loop(cancelToken);
      });

      return function() {
        cancelToken.cancel();
        sceneManager.detach();
      };
    },
    [props.sceneManager, threeCanvas]
  );

  return (
    <canvas
      className={classnames("dd__scene__canvas", {
        "dd__scene__canvas--loading": props.resourcesLoadingState.isLoading()
      })}
      ref={setThreeCanvas}
    />
  );
}
