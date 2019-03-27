// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HudSceneLocationComplexCanvas from "./HudSceneLocationComplexCanvas";
import SceneManager from "../framework/classes/SceneManager";

// import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../framework/interfaces/HTMLElementResizeObserver";
// import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {||};

export default function HudSceneLocationComplex(props: Props) {
  const [ cancelToken ] = React.useState(new CancelToken());
  const [ htmlElementResizeObserver ] = React.useState(new HTMLElementResizeObserver());
  const [ sceneManager ] = React.useState(new SceneManager(new CanvasLocationComplex()));

  async function htmlElementResizeObserve() {
    for await (let evt of htmlElementResizeObserver.listen(cancelToken)) {
      sceneManager.resize(evt.getHTMLElementSize());
    }
  }

  function setScene(scene: ?HTMLElement): void {
    if (scene) {
      htmlElementResizeObserver.observe(scene);
    } else {
      htmlElementResizeObserver.unobserve();
    }
  }

  React.useEffect(function () {
    htmlElementResizeObserve();

    return function () {
      cancelToken.cancel();
    };
  }, [ cancelToken ]);

  return (
    <div
      className="dd__scene dd__scene--hud dd__scene--canvas"
      ref={setScene}
    >
      <HudSceneLocationComplexCanvas sceneManager={sceneManager} />
    </div>
  );
}
