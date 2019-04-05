// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HudSceneCanvas from "./HudSceneCanvas";

import type { CancelToken as CancelTokenInterface } from "../framework/interfaces/CancelToken";
import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../framework/interfaces/HTMLElementResizeObserver";
import type { SceneManager } from "../framework/interfaces/SceneManager";

type Props = {|
  sceneManager: SceneManager
|};

async function htmlElementResizeObserve(
  cancelToken: CancelTokenInterface,
  htmlElementResizeObserver: HTMLElementResizeObserverInterface,
  sceneManager: SceneManager
) {
  for await (let evt of htmlElementResizeObserver.listen(cancelToken)) {
    sceneManager.resize(evt.getHTMLElementSize());
  }
}

export default function HudSceneManager(props: Props) {
  const [scene, setScene] = React.useState(null);
  const [htmlElementResizeObserver] = React.useState(
    new HTMLElementResizeObserver()
  );

  React.useEffect(
    function() {
      const cancelToken = new CancelToken();
      const sceneManager = props.sceneManager;

      htmlElementResizeObserve(
        cancelToken,
        htmlElementResizeObserver,
        sceneManager
      );

      return function() {
        cancelToken.cancel();
      };
    },
    [htmlElementResizeObserver, props.sceneManager, scene]
  );

  React.useEffect(
    function() {
      if (!scene) {
        return;
      }

      // keep the old reference in case state changes
      const observer = htmlElementResizeObserver;

      observer.observe(scene);

      return function() {
        observer.unobserve();
      };
    },
    [htmlElementResizeObserver, props.sceneManager, scene]
  );

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      <HudSceneCanvas sceneManager={props.sceneManager} />
    </div>
  );
}
