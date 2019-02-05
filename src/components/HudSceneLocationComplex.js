// @flow

import * as React from "react";
import autoBind from "auto-bind";

import CancelToken from "../framework/classes/CancelToken";
import HTMLElementResizeObserver from "../ddui/classes/HTMLElementResizeObserver";
import SceneLocationComplex from "../ddui/controllers/SceneLocationComplex";
import SceneManager from "../ddui/classes/SceneManager";

type Props = {||};

type State = {||};

export default class HudSceneLocationComplex extends React.Component<
  Props,
  State
> {
  cancelToken: CancelToken;
  canvas: ?HTMLCanvasElement;
  htmlElementResizeObserver: HTMLElementResizeObserver;
  scene: ?HTMLElement;
  sceneManager: SceneManager<HTMLCanvasElement>;

  constructor(props: Props) {
    super(props);

    autoBind.react(this);

    this.cancelToken = new CancelToken();
    this.htmlElementResizeObserver = new HTMLElementResizeObserver();
    this.sceneManager = new SceneManager(
      this.cancelToken,
      new SceneLocationComplex()
    );
  }

  async componentDidMount() {
    for await (let evt of this.htmlElementResizeObserver.listen(
      this.cancelToken
    )) {
      this.sceneManager.controller.resize(evt.width, evt.height);
    }
  }

  componentWillUnmount() {
    this.cancelToken.cancel();
  }

  setScene(scene: ?HTMLElement): void {
    this.scene = scene;

    if (scene) {
      this.htmlElementResizeObserver.observe(scene);
    } else {
      this.htmlElementResizeObserver.unobserve();
    }
  }

  async setThreeCanvas(canvas: ?HTMLCanvasElement): Promise<void> {
    const previousCanvas = this.canvas;

    this.canvas = canvas;

    if (previousCanvas) {
      await this.sceneManager.detach(previousCanvas);
    }

    // nothing changed while awaiting for canvas unmount
    if (canvas && this.canvas === canvas && !this.cancelToken.isCancelled()) {
      await this.sceneManager.attach(canvas);
    }
  }

  render() {
    return (
      <div
        className="dd__scene dd__scene--hud dd__scene--canvas"
        ref={this.setScene}
      >
        <canvas ref={this.setThreeCanvas} />
      </div>
    );
  }
}
