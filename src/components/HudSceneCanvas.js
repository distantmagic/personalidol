// @flow

import * as React from "react";
import classnames from "classnames";
import debounce from "lodash/debounce";
import ResizeObserver from "resize-observer-polyfill";

import CancelToken from "../framework/classes/CancelToken";
import ElementSize from "../framework/classes/ElementSize";
import HTMLElementSize from "../framework/classes/HTMLElementSize";

import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager } from "../framework/interfaces/SceneManager";

type Props = {|
  resourcesLoadingState: ResourcesLoadingState,
  sceneManager: SceneManager
|};

export default function HudSceneCanvas(props: Props) {
  const [scene, setScene] = React.useState(null);
  const [isAttaching, setIsAttaching] = React.useState(true);
  const [canvas, setCanvas] = React.useState(null);

  React.useEffect(
    function() {
      if (!scene) {
        return;
      }

      const element = scene;
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

      props.sceneManager.resize(new HTMLElementSize(element));
      resizeObserver.observe(element);

      return function() {
        resizeObserver.disconnect();
      };
    },
    [props.sceneManager, scene]
  );

  React.useEffect(
    function() {
      if (!canvas) {
        return;
      }

      const cancelToken = new CancelToken();
      const sceneManager = props.sceneManager;

      setIsAttaching(true);
      sceneManager.attach(canvas).then(function() {
        if (!cancelToken.isCancelled()) {
          setIsAttaching(false);
        }
        sceneManager.loop(cancelToken);
      });

      return function() {
        cancelToken.cancel();
        sceneManager.detach();
      };
    },
    [props.sceneManager, canvas]
  );

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      {props.resourcesLoadingState.isFailed() && (
        <div className="dd__loader dd__loader--error dd__scene__loader">
          Failed loading assets.
        </div>
      )}
      {props.resourcesLoadingState.isLoading() && (
        <div className="dd__loader dd__scene__loader">
          Loading asset {props.resourcesLoadingState.getItemsLoaded()}
          {" of "}
          {props.resourcesLoadingState.getItemsTotal()}
          ...
        </div>
      )}
      {!props.resourcesLoadingState.isLoading() && isAttaching && (
        <div className="dd__loader dd__scene__loader">Loading scene...</div>
      )}
      <canvas
        className={classnames("dd__scene__canvas", {
          "dd__scene__canvas--attaching": isAttaching,
          "dd__scene__canvas--loading": props.resourcesLoadingState.isLoading()
        })}
        ref={setCanvas}
      />
    </div>
  );
}
