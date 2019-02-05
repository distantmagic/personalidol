// @flow

import * as React from "react";
import autoBind from "auto-bind";

import CancelToken from "../framework/classes/CancelToken";
import SceneLocationComplex from "../ddui/controllers/SceneLocationComplex";
import SceneManager from "../ddui/classes/SceneManager";

type Props = {||};

type State = {||};

export default class HudSceneLocationComplex extends React.Component<
  Props,
  State
> {
  cancelToken: CancelToken;
  sceneManager: SceneManager<HTMLCanvasElement>;
  threeScene: ?HTMLCanvasElement;

  constructor(props: Props) {
    super(props);

    autoBind.react(this);

    this.cancelToken = new CancelToken();
    this.sceneManager = new SceneManager(
      this.cancelToken,
      new SceneLocationComplex()
    );
  }

  componentWillUnmount() {
    this.cancelToken.cancel();
  }

  setScene(scene: ?HTMLElement): void {
    const update = () => {
      if (scene) {
        this.sceneManager.controller.resize(
          scene.offsetWidth,
          scene.offsetHeight
        );
      }
    };

    setInterval(update, 40);
    update();
  }

  async setThreeCanvas(canvas: ?HTMLCanvasElement): Promise<void> {
    const previousScene = this.threeScene;

    this.threeScene = canvas;

    if (previousScene) {
      await this.sceneManager.detach(previousScene);
    }

    // nothing changed while awaiting for canvas unmount
    if (
      canvas &&
      this.threeScene === canvas &&
      !this.cancelToken.isCancelled()
    ) {
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
