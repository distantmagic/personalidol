// @flow

import * as React from "react";
import classnames from "classnames";

import CancelToken from "../framework/classes/CancelToken";
import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import HudSceneCanvasOverlay from "./HudSceneCanvasOverlay";
import PointerState from "../framework/classes/PointerState";
import ResourcesLoadingState from "../framework/classes/ResourcesLoadingState";
import SceneManager from "../framework/classes/SceneManager";
import THREELoadingManager from "../framework/classes/THREELoadingManager";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { KeyboardState } from "../framework/interfaces/KeyboardState";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { PointerState as PointerStateInterface } from "../framework/interfaces/PointerState";
import type { QueryBus } from "../framework/interfaces/QueryBus";
import type { ResourcesLoadingState as ResourcesLoadingStateInterface } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";
import type { Scheduler } from "../framework/interfaces/Scheduler";
import type { THREELoadingManager as THREELoadingManagerInterface } from "../framework/interfaces/THREELoadingManager";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  keyboardState: KeyboardState,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  scheduler: Scheduler,
  queryBus: QueryBus
|};

function useResourcesLoadingState(
  props: Props,
  threeLoadingManager: THREELoadingManagerInterface,
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
      const loadingManagerReference = threeLoadingManager;
      const sceneManagerReference = sceneManager;

      sceneManagerReference.start();

      function onError(url: string) {
        sceneManagerReference
          .stop()
          .catch(
            props.exceptionHandler.expectException(
              props.loggerBreadcrumbs
                .add("threeLoadingManager.onError")
                .add("sceneManager.stop.catch")
            )
          );
      }

      function onLoad() {
        sceneManagerReference
          .start()
          .catch(
            props.exceptionHandler.expectException(
              props.loggerBreadcrumbs
                .add("threeLoadingManager.onLoad")
                .add("sceneManager.start.catch")
            )
          );
      }

      function onProgress(url, itemsLoaded, itemsTotal) {
        sceneManagerReference
          .stop()
          .catch(
            props.exceptionHandler.expectException(
              props.loggerBreadcrumbs
                .add("threeLoadingManager.onProgress")
                .add("sceneManager.stop.catch")
            )
          );
      }

      function onStart(url, itemsLoaded, itemsTotal) {
        sceneManagerReference
          .stop()
          .catch(
            props.exceptionHandler.expectException(
              props.loggerBreadcrumbs
                .add("threeLoadingManager.onStart")
                .add("sceneManager.stop.catch")
            )
          );
      }

      loadingManagerReference.onError(onError);
      loadingManagerReference.onLoad(onLoad);
      loadingManagerReference.onProgress(onProgress);
      loadingManagerReference.onResourcesLoadingStateChange(setLoadingState);
      loadingManagerReference.onStart(onStart);

      return function() {
        loadingManagerReference.offError(onError);
        loadingManagerReference.offLoad(onLoad);
        loadingManagerReference.offProgress(onProgress);
        loadingManagerReference.offResourcesLoadingStateChange(setLoadingState);
        loadingManagerReference.offStart(onStart);
      };
    },
    [threeLoadingManager, sceneManager]
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

      const attachCancelToken = new CancelToken();
      const manager = sceneManager;

      setSceneLoadingState({
        isAttaching: true,
        isFailed: false
      });

      manager
        .attach(attachCancelToken, canvas)
        .then(function() {
          if (attachCancelToken.isCancelled()) {
            return;
          }

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

          if (attachCancelToken.isCancelled()) {
            return;
          }

          setSceneLoadingState({
            isAttaching: false,
            isFailed: true
          });
        });

      return function() {
        attachCancelToken.cancel();

        manager
          // currently there is no scenario where detach should be cancelled,
          // but nonetheless this one should be here for consistency
          .detach(new CancelToken())
          .catch(
            props.exceptionHandler.expectException(
              props.loggerBreadcrumbs.add("sceneManager.detach.catch")
            )
          );
      };
    },
    [sceneManager, canvas]
  );

  return [sceneLoadingState.isFailed, sceneLoadingState.isAttaching];
}

function useSceneManager(
  props: Props,
  pointerState: ?PointerStateInterface,
  threeLoadingManager: THREELoadingManagerInterface
) {
  const [
    sceneManager,
    setSceneManager
  ] = React.useState<?SceneManagerInterface>(null);

  React.useEffect(
    function() {
      if (!pointerState) {
        return;
      }

      setSceneManager(
        new SceneManager(
          props.loggerBreadcrumbs.add("SceneManager"),
          props.exceptionHandler,
          props.scheduler,
          new CanvasLocationComplex(
            props.exceptionHandler,
            props.loggerBreadcrumbs.add("CanvasLocationComplex"),
            threeLoadingManager,
            props.keyboardState,
            pointerState,
            props.queryBus,
            props.debug
          )
        )
      );
    },
    [pointerState, props.scheduler, threeLoadingManager]
  );

  return [sceneManager];
}

export default function HudSceneCanvas(props: Props) {
  const [canvas, setCanvas] = React.useState<?HTMLCanvasElement>(null);
  const [threeLoadingManager] = React.useState<THREELoadingManagerInterface>(
    new THREELoadingManager(
      props.loggerBreadcrumbs.add("THREELoadingManager"),
      props.exceptionHandler
    )
  );
  const [
    pointerState,
    setPointerState
  ] = React.useState<?PointerStateInterface>(null);
  const [sceneManager] = useSceneManager(
    props,
    pointerState,
    threeLoadingManager
  );
  const [isFailed, isAttaching] = useScene(props, sceneManager, canvas);
  const [resourcesLoadingState] = useResourcesLoadingState(
    props,
    threeLoadingManager,
    sceneManager
  );
  const [scene, setScene] = React.useState<?HTMLElement>(null);

  React.useEffect(
    function() {
      if (!scene) {
        return;
      }

      const pointerState = new PointerState(scene);

      pointerState.observe();

      setPointerState(pointerState);

      return function() {
        pointerState.disconnect();
      };
    },
    [scene]
  );

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

  return (
    <div className="dd__scene dd__scene--hud dd__scene--canvas" ref={setScene}>
      {sceneManager ? (
        <React.Fragment>
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
        </React.Fragment>
      ) : (
        <div className="dd__loader dd__scene__loader">
          Initializing scene...
        </div>
      )}
    </div>
  );
}
