// @flow

import * as React from "react";
import * as THREE from "three";
import classnames from "classnames";
import debounce from "lodash/debounce";
import ResizeObserver from "resize-observer-polyfill";

import CancelToken from "../framework/classes/CancelToken";
import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import ElementSize from "../framework/classes/ElementSize";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import HudSceneCanvasOverlay from "./HudSceneCanvasOverlay";
import ResourceLoadError from "../framework/classes/Exception/ResourceLoadError";
import ResourcesLoadingState from "../framework/classes/ResourcesLoadingState";
import SceneManager from "../framework/classes/SceneManager";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { FPSAdaptive } from "../framework/interfaces/FPSAdaptive";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { MainLoop } from "../framework/interfaces/MainLoop";
import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  fpsAdaptive: FPSAdaptive,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  mainLoop: MainLoop
|};

function useResourcesLoadingState(
  props: Props,
  loadingManager: THREE.LoadingManager
) {
  const [
    resourcesLoadingState,
    setLoadingState
  ] = React.useState<ResourcesLoadingStateInterface>(
    new ResourcesLoadingState(0, 0)
  );

  React.useEffect(
    function() {
      // keep the old reference
      const manager = loadingManager;
      let globalItemsLoaded = 0;
      let globalItemsTotal = 0;
      let error = null;

      manager.onStart = function(url, itemsLoaded, itemsTotal) {
        setLoadingState(
          new ResourcesLoadingState(itemsLoaded, itemsTotal, error)
        );
      };

      manager.onProgress = function(url, itemsLoaded, itemsTotal) {
        globalItemsLoaded = itemsLoaded;
        globalItemsTotal = itemsTotal;

        setLoadingState(
          new ResourcesLoadingState(itemsLoaded, itemsTotal, error)
        );
      };

      manager.onError = function(url: string) {
        error = new ResourceLoadError(url);
        props.exceptionHandler.captureException(
          props.loggerBreadcrumbs.add("loadingManager.onError"),
          error
        );

        setLoadingState(
          new ResourcesLoadingState(globalItemsLoaded, globalItemsTotal, error)
        );
      };

      return function() {
        delete manager.onError;
        delete manager.onProgress;
        delete manager.onStart;
      };
    },
    [loadingManager]
  );

  return [resourcesLoadingState];
}

function useScene(
  props: Props,
  sceneManager: ?SceneManagerInterface,
  canvas: ?HTMLCanvasElement
): [boolean, boolean] {
  const [sceneLoadingState, setSceneLoadingState] = React.useState<{|
    isAttaching: boolean,
    isFailed: boolean
  |}>({
    isAttaching: false,
    isFailed: false
  });

  React.useEffect(
    function() {
      if (!canvas || !sceneManager) {
        return;
      }

      const cancelToken = new CancelToken();
      const manager = sceneManager;

      setSceneLoadingState({
        isAttaching: true,
        isFailed: false
      });

      manager
        .attach(canvas)
        .then(function() {
          if (cancelToken.isCancelled()) {
            return;
          }

          setSceneLoadingState({
            isAttaching: false,
            isFailed: false
          });

          return manager.loop(cancelToken);
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
        manager.detach();
      };
    },
    [sceneManager, canvas]
  );

  return [sceneLoadingState.isFailed, sceneLoadingState.isAttaching];
}

function useSceneManager(props: Props, loadingManager: THREE.LoadingManager) {
  const [
    sceneManager,
    setSceneManager
  ] = React.useState<?SceneManagerInterface>(null);

  React.useEffect(
    function() {
      setSceneManager(
        new SceneManager(
          props.mainLoop,
          new CanvasLocationComplex(
            loadingManager,
            props.fpsAdaptive,
            props.loggerBreadcrumbs.add("CanvasLocationComplex"),
            props.debug
          )
        )
      );
    },
    [props.mainLoop, loadingManager]
  );

  return [sceneManager];
}

export default function HudSceneCanvas(props: Props) {
  const [canvas, setCanvas] = React.useState<?HTMLCanvasElement>(null);
  const [loadingManager] = React.useState<THREE.LoadingManager>(
    new THREE.LoadingManager()
  );
  const [resourcesLoadingState] = useResourcesLoadingState(
    props,
    loadingManager
  );
  const [sceneManager] = useSceneManager(props, loadingManager);
  const [isFailed, isAttaching] = useScene(props, sceneManager, canvas);
  const [scene, setScene] = React.useState<?HTMLElement>(null);

  React.useEffect(
    function() {
      if (!scene || !sceneManager) {
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

            sceneManager.resize(elementSize);
          }
        }, 300)
      );

      sceneManager.resize(new HTMLElementSize(element));
      resizeObserver.observe(element);

      return function() {
        resizeObserver.disconnect();
      };
    },
    [sceneManager, scene]
  );

  if (!sceneManager) {
    return (
      <div className="dd__scene dd__scene--hud dd__scene--canvas">
        <div className="dd__loader dd__scene__loader">
          Initializing scene...
        </div>
      </div>
    );
  }

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      <HudSceneCanvasOverlay
        isFailed={isFailed || resourcesLoadingState.isFailed()}
        isAttaching={isAttaching}
        isLoading={resourcesLoadingState.isLoading()}
        itemsLoaded={resourcesLoadingState.getItemsLoaded()}
        itemsTotal={resourcesLoadingState.getItemsTotal()}
      />
      <canvas
        className={classnames("dd__scene__canvas", {
          "dd__scene__canvas--attaching": isAttaching,
          "dd__scene__canvas--loading": resourcesLoadingState.isLoading()
        })}
        ref={setCanvas}
      />
    </div>
  );
}
