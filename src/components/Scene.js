// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import Dialogue from "./Dialogue";
import { default as DialogueScene } from "../framework/classes/Scene/Dialogue";
import { default as DialogueSceneState } from "../framework/classes/SceneState/Dialogue";

type Props = {
  cancelToken: CancelToken,
  dialogueScene: DialogueScene
};

type State = {
  sceneState: ?DialogueSceneState
};

export default class Scene extends React.Component<Props, State> {
  state = {
    sceneState: null
  };

  async componentDidMount() {
    const stateGenerator = this.props.dialogueScene.awaitStateUpdates(
      this.props.cancelToken
    );

    for await (const sceneState of stateGenerator) {
      if (!this.props.cancelToken.isCancelled()) {
        this.setState({
          sceneState: sceneState
        });
      }
    }
  }

  render() {
    const sceneState = this.state.sceneState;

    if (!sceneState) {
      return null;
    }

    return <Dialogue sceneState={sceneState} />;
  }
}
