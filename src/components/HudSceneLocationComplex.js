// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HudSceneLocationComplexCanvas from "./HudSceneLocationComplexCanvas";
import SceneManager from "../framework/classes/SceneManager";

import type { CancelToken as CancelTokenInterface } from "../framework/interfaces/CancelToken";

type Props = {||};

export default function HudSceneLocationComplex(props: Props) {
  const [scene, setScene] = React.useState(null);
  const [htmlElementResizeObserver] = React.useState(
    new HTMLElementResizeObserver()
  );
  const [sceneManager] = React.useState(
    new SceneManager(new CanvasLocationComplex())
  );

  async function htmlElementResizeObserve(cancelToken: CancelTokenInterface) {
    for await (let evt of htmlElementResizeObserver.listen(cancelToken)) {
      sceneManager.resize(evt.getHTMLElementSize());
    }
  }

  React.useEffect(
    function() {
      const cancelToken = new CancelToken();

      htmlElementResizeObserve(cancelToken);

      return function() {
        cancelToken.cancel();
      };
    },
    [scene]
  );

  React.useEffect(
    function() {
      if (!scene) {
        return;
      }

      htmlElementResizeObserver.observe(scene);

      return function() {
        htmlElementResizeObserver.unobserve();
      };
    },
    [scene]
  );

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      <HudSceneLocationComplexCanvas sceneManager={sceneManager} />
    </div>
  );
}
