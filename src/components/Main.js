// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
// import Dialogue from "../framework/classes/Dialogue";
import Scene from "./Scene";
import { default as DialogueScene } from "../framework/classes/Scene/Dialogue";
import { default as DialogueSceneState } from "../framework/classes/SceneState/Dialogue";

type Props = {};

type State = {
  dialogueScene: DialogueScene,
  error: ?Error
};

export default class Main extends React.Component<Props, State> {
  cancelToken: CancelToken;

  constructor(props: Props) {
    super(props);

    this.cancelToken = new CancelToken();
    this.state = {
      dialogueScene: new DialogueScene(),
      error: null
    };
  }

  componentDidCatch(error: Error, errorInfo: Object) {
    this.setState({
      error: error
    });
  }

  componentDidMount() {
    this.state.dialogueScene.setSceneState(new DialogueSceneState());
  }

  componentWillUnmount() {
    this.cancelToken.cancel();
  }

  render() {
    return (
      <div>
        <Scene
          cancelToken={this.cancelToken}
          dialogueScene={this.state.dialogueScene}
        />
        <Scene
          cancelToken={this.cancelToken}
          dialogueScene={this.state.dialogueScene}
        />
        <Scene
          cancelToken={this.cancelToken}
          dialogueScene={this.state.dialogueScene}
        />
      </div>
    );
  }
}
