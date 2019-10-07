// @flow

import * as React from "react";
import classnames from "classnames";

import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import HudSceneOverlay from "./HudSceneOverlay";
import MainView from "../app/classes/MainView";

import type { Debugger } from "../framework/interfaces/Debugger";
import type { ExceptionHandler } from "../framework/interfaces/ExceptionHandler";
import type { Game } from "../framework/interfaces/Game";
import type { LoggerBreadcrumbs } from "../framework/interfaces/LoggerBreadcrumbs";
import type { QueryBus } from "../framework/interfaces/QueryBus";
import type { ResourcesLoadingState } from "../framework/interfaces/ResourcesLoadingState";
import type { SceneManager } from "../framework/interfaces/SceneManager";
import type { Scheduler } from "../framework/interfaces/Scheduler";

type Props = {|
  debug: Debugger,
  exceptionHandler: ExceptionHandler,
  game: Game,
  loggerBreadcrumbs: LoggerBreadcrumbs,
  scheduler: Scheduler,
  queryBus: QueryBus,
|};

export default function HudScene(props: Props) {
  const threeLoadingManager = props.game.getTHREELoadingManager();

  // const [isFailed, isAttaching] = useScene(props, sceneManager, canvas);
  const [resourcesLoadingState, setResourcesLoadingState] = React.useState<ResourcesLoadingState>(
    threeLoadingManager.getResourcesLoadingState()
  );
  const [scene, setScene] = React.useState<?HTMLElement>(null);
  const [sceneManager, setSceneManager] = React.useState<?SceneManager>(
    props.game.hasSceneManager() ? props.game.getSceneManager() : null
  );
  const [isAttaching, setIsAttaching] = React.useState<boolean>(sceneManager ? sceneManager.isAttaching() : true);

  React.useEffect(
    function() {
      const game = props.game;

      game.onSceneManagerChange(setSceneManager);
      game.setPrimaryController(
        new MainView(
          game.getExceptionHandler(),
          props.loggerBreadcrumbs.add("MainView"),
          threeLoadingManager,
          game.getKeyboardState(),
          game.getPointerState(),
          game.getQueryBus(),
          props.debug
        )
      );

      return function() {
        game.offSceneManagerChange(setSceneManager);
      };
    },
    [props.debug, props.game, props.loggerBreadcrumbs, threeLoadingManager]
  );

  React.useEffect(
    function() {
      threeLoadingManager.onResourcesLoadingStateChange(setResourcesLoadingState);

      return function() {
        threeLoadingManager.offResourcesLoadingStateChange(setResourcesLoadingState);
      };
    },
    [threeLoadingManager]
  );

  React.useEffect(
    function() {
      if (!sceneManager) {
        return;
      }

      function onStateChange() {
        setIsAttaching(sceneManager.isAttaching());
      }

      setIsAttaching(sceneManager.isAttaching());
      sceneManager.onStateChange(onStateChange);

      return function() {
        sceneManager.offStateChange(onStateChange);
      };
    },
    [sceneManager]
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
          <HudSceneOverlay
            isFailed={resourcesLoadingState.isFailed()}
            isAttaching={isAttaching}
            isLoading={resourcesLoadingState.isLoading()}
            itemsLoaded={resourcesLoadingState.getItemsLoaded()}
            itemsTotal={resourcesLoadingState.getItemsTotal()}
          />
          <canvas
            className={classnames("dd__scene__canvas", {
              "dd__scene__canvas--attaching": isAttaching,
              "dd__scene__canvas--loading": resourcesLoadingState.isLoading(),
            })}
            ref={sceneManager.setCanvasElement}
          />
        </React.Fragment>
      ) : (
        <div className="dd__loader dd__scene__loader">Initializing scene...</div>
      )}
    </div>
  );
}
