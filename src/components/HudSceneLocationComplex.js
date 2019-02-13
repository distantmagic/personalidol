// @flow

import * as React from "react";
import autoBind from "auto-bind";

import CancelToken from "../framework/classes/CancelToken";
import CanvasLocationComplex from "../controllers/CanvasLocationComplex";
import HTMLElementResizeObserver from "../framework/classes/HTMLElementResizeObserver";
import HudSceneLocationComplexCanvas from "./HudSceneLocationComplexCanvas";
import SceneManager from "../framework/classes/SceneManager";

import type { HTMLElementResizeObserver as HTMLElementResizeObserverInterface } from "../framework/interfaces/HTMLElementResizeObserver";
import type { SceneManager as SceneManagerInterface } from "../framework/interfaces/SceneManager";

type Props = {||};

type State = {||};

export default class HudSceneLocationComplex extends React.Component<
  Props,
  State
> {
  +cancelToken: CancelToken;
  +htmlElementResizeObserver: HTMLElementResizeObserverInterface;
  +sceneManager: SceneManagerInterface;
  canvas: ?HTMLCanvasElement;

  constructor(props: Props) {
    super(props);

    autoBind.react(this);

    this.cancelToken = new CancelToken();
    this.htmlElementResizeObserver = new HTMLElementResizeObserver();
    this.sceneManager = new SceneManager(new CanvasLocationComplex());
  }

  async componentDidMount(): Promise<void> {
    for await (let evt of this.htmlElementResizeObserver.listen(
      this.cancelToken
    )) {
      this.sceneManager.resize(evt.getHTMLElementSize());
    }
  }

  componentWillUnmount(): void {
    this.cancelToken.cancel();
  }

  setScene(scene: ?HTMLElement): void {
    if (scene) {
      this.htmlElementResizeObserver.observe(scene);
    } else {
      this.htmlElementResizeObserver.unobserve();
    }
  }

  render() {
    return (
      <div
        className="dd__scene dd__scene--hud dd__scene--canvas"
        ref={this.setScene}
      >
        <HudSceneLocationComplexCanvas sceneManager={this.sceneManager} />
      </div>
    );
  }
}
