// @flow

import * as React from "react";
import classnames from "classnames";
import debounce from "lodash/debounce";
import ResizeObserver from "resize-observer-polyfill";

import CancelToken from "../framework/classes/CancelToken";
import ElementSize from "../framework/classes/ElementSize";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import HudSceneCanvasOverlay from "./HudSceneCanvasOverlay";

import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager } from "../framework/interfaces/SceneManager";

type Props = {|
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  resourcesLoadingState: ResourcesLoadingState,
  sceneManager: SceneManager
|};

function useScene(props: Props, canvas: ?HTMLCanvasElement) {
  const [sceneLoadingState, setSceneLoadingState] = React.useState<{|
    isAttaching: boolean,
    isFailed: boolean
  |}>({
    isAttaching: false,
    isFailed: false
  });

  React.useEffect(
    function() {
      if (!canvas) {
        return;
      }

      const cancelToken = new CancelToken();
      const sceneManager = props.sceneManager;

      setSceneLoadingState({
        isAttaching: true,
        isFailed: false
      });

      sceneManager
        .attach(canvas)
        .then(function() {
          if (cancelToken.isCancelled()) {
            return;
          }

          setSceneLoadingState({
            isAttaching: false,
            isFailed: false
          });

          return sceneManager.loop(cancelToken);
        })
        .catch(function(err: Error) {
          props.exceptionHandler.captureException(
            props.loggerBreadcrumbs.add("sceneManager.attach.catch"),
            err
          );

          if (cancelToken.isCancelled()) {
            return;
          }

          setSceneLoadingState({
            isAttaching: false,
            isFailed: true
          });
        });

      return function() {
        cancelToken.cancel();
        sceneManager.detach();
      };
    },
    [props.sceneManager, canvas]
  );

  return [sceneLoadingState.isFailed, sceneLoadingState.isAttaching];
}

export default function HudSceneCanvas(props: Props) {
  const [canvas, setCanvas] = React.useState<?HTMLCanvasElement>(null);
  const [isFailed, isAttaching] = useScene(props, canvas);
  const [scene, setScene] = React.useState<?HTMLElement>(null);

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

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      <HudSceneCanvasOverlay
        isFailed={isFailed || props.resourcesLoadingState.isFailed()}
        isAttaching={isAttaching}
        isLoading={props.resourcesLoadingState.isLoading()}
        itemsLoaded={props.resourcesLoadingState.getItemsLoaded()}
        itemsTotal={props.resourcesLoadingState.getItemsTotal()}
      />
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
