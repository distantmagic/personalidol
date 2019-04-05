// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HudSceneCanvas from "./HudSceneCanvas";

import type { CancelToken as CancelTokenInterface } from "../framework/interfaces/CancelToken";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
  sceneManager: SceneManagerInterface
|};

export default function HudSceneManager(props: Props) {
  const [scene, setScene] = React.useState(null);
  const [htmlElementResizeObserver] = React.useState(
    new HTMLElementResizeObserver()
  );

  async function htmlElementResizeObserve(cancelToken: CancelTokenInterface) {
    for await (let evt of htmlElementResizeObserver.listen(cancelToken)) {
      props.sceneManager.resize(evt.getHTMLElementSize());
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
    [props.sceneManager, scene]
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
    [htmlElementResizeObserver, props.sceneManager, scene]
  );

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      <HudSceneCanvas sceneManager={props.sceneManager} />
    </div>
  );
}
