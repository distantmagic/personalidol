// @flow

import * as React from "react";
import debounce from "lodash/debounce";
import ResizeObserver from "resize-observer-polyfill";

import ElementSize from "../framework/classes/ElementSize";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import HudSceneCanvas from "./HudSceneCanvas";

import type { SceneManager } from "../framework/interfaces/SceneManager";

type Props = {|
  sceneManager: SceneManager
|};

export default function HudSceneManager(props: Props) {
  const [scene, setScene] = React.useState(null);

  React.useEffect(
    function() {
      if (!scene) {
        return;
      }

      const resizeObserver = new ResizeObserver(
        debounce(function(mutationList) {
          for (let mutation of mutationList) {
            const contentRect = mutation.contentRect;
            const elementSize = new ElementSize(
              contentRect.width,
              contentRect.height
            );

            props.sceneManager.resize(elementSize);
          }
        }, 300)
      );

      props.sceneManager.resize(new HTMLElementSize(scene));
      resizeObserver.observe(scene);

      return function() {
        resizeObserver.disconnect();
      };
    },
    [props.sceneManager, scene]
  );

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      <HudSceneCanvas sceneManager={props.sceneManager} />
    </div>
  );
}
