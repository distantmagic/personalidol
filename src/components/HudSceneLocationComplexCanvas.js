// @flow

import * as React from "react";
import autoBind from "auto-bind";

import CancelToken from "../framework/classes/CancelToken";

import type { SceneManager as SceneManagerInterface } from "../ddui/interfaces/SceneManager";

type Props = {|
  sceneManager: SceneManagerInterface
|};

type State = {||};

export default class HudSceneLocationComplexCanvas extends React.Component<
  Props,
  State
> {
  +cancelToken: CancelToken;
  +sceneManager: SceneManagerInterface;

  constructor(props: Props) {
    super(props);

    autoBind.react(this);

    this.cancelToken = new CancelToken();
  }

  async componentDidMount(): Promise<void> {
    await this.props.sceneManager.loop(this.cancelToken);
  }

  componentWillUnmount(): void {
    this.cancelToken.cancel();
  }

  async setThreeCanvas(canvas: ?HTMLCanvasElement): Promise<void> {
    if (canvas) {
      this.props.sceneManager.attach(canvas);
    }
  }

  render() {
    return <canvas ref={this.setThreeCanvas} />;
  }
}
