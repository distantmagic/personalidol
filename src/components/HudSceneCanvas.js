// @flow

import * as React from "react";
import * as THREE from "three";
import classnames from "classnames";

import CancelToken from "../framework/classes/CancelToken";
import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import HudSceneCanvasOverlay from "./HudSceneCanvasOverlay";
import ResourceLoadError from "../framework/classes/Exception/ResourceLoadError";
import ResourcesLoadingState from "../framework/classes/ResourcesLoadingState";
import SceneManager from "../framework/classes/SceneManager";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";
import type { Scheduler } from "../framework/interfaces/Scheduler";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  scheduler: Scheduler
|};

function useResourcesLoadingState(
  props: Props,
  loadingManager: THREE.LoadingManager,
  sceneManager: ?SceneManagerInterface
) {
  const [
    resourcesLoadingState,
    setLoadingState
  ] = React.useState<ResourcesLoadingStateInterface>(
    new ResourcesLoadingState(0, 0)
  );

  React.useEffect(
    function() {
      if (!sceneManager) {
        return;
      }

      // keep the old reference
      const loadingManagerReference = loadingManager;
      const sceneManagerReference = sceneManager;

      let globalItemsLoaded = 0;
      let globalItemsTotal = 0;
      let error = null;

      loadingManagerReference.onLoad = function() {
        sceneManagerReference.start();
      };

      loadingManagerReference.onStart = function(url, itemsLoaded, itemsTotal) {
        setLoadingState(
          new ResourcesLoadingState(itemsLoaded, itemsTotal, error)
        );
      };

      loadingManagerReference.onProgress = function(
        url,
        itemsLoaded,
        itemsTotal
      ) {
        sceneManagerReference.stop();
        globalItemsLoaded = itemsLoaded;
        globalItemsTotal = itemsTotal;

        setLoadingState(
          new ResourcesLoadingState(itemsLoaded, itemsTotal, error)
        );
      };

      loadingManagerReference.onError = function(url: string) {
        sceneManagerReference.stop();

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
        delete loadingManagerReference.onError;
        delete loadingManagerReference.onProgress;
        delete loadingManagerReference.onStart;
      };
    },
    [loadingManager, sceneManager]
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
          setSceneLoadingState({
            isAttaching: false,
            isFailed: false
          });
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
          props.exceptionHandler,
          props.loggerBreadcrumbs.add("SceneManager"),
          props.scheduler,
          new CanvasLocationComplex(
            loadingManager,
            props.loggerBreadcrumbs.add("CanvasLocationComplex"),
            props.debug
          )
        )
      );
    },
    [props.scheduler, loadingManager]
  );

  return [sceneManager];
}

export default function HudSceneCanvas(props: Props) {
  const [canvas, setCanvas] = React.useState<?HTMLCanvasElement>(null);
  const [loadingManager] = React.useState<THREE.LoadingManager>(
    new THREE.LoadingManager()
  );
  const [sceneManager] = useSceneManager(props, loadingManager);
  const [isFailed, isAttaching] = useScene(props, sceneManager, canvas);
  const [resourcesLoadingState] = useResourcesLoadingState(
    props,
    loadingManager,
    sceneManager
  );
  const [scene, setScene] = React.useState<?HTMLElement>(null);

  React.useEffect(
    function() {
      if (!scene || !sceneManager) {
        return;
      }

      const resizeObserver = new HTMLElementResizeObserver(scene);

      resizeObserver.notify(sceneManager);
      resizeObserver.observe();

      sceneManager.resize(new HTMLElementSize(scene));

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
