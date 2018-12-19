// @flow

import * as React from "react";

import CancelToken from "../framework/classes/CancelToken";
import { default as DialogueScene } from "../domain/classes/Scene/Dialogue";
import { default as DialogueSceneState } from "../domain/classes/SceneState/Dialogue";

type Props = {
  dialogueScene: DialogueScene
};

type State = {
  sceneState: ?DialogueSceneState
};

export default class Scene extends React.Component<Props, State> {
  cancelToken: CancelToken;

  state = {
    sceneState: null
  };

  constructor(props: Props) {
    super(props);

    this.cancelToken = new CancelToken();
  }

  async componentDidMount() {
    for await (const sceneState of this.props.dialogueScene.awaitStateUpdates(
      this.cancelToken
    )) {
      if (!this.cancelToken.isCancelled()) {
        this.setState({
          sceneState: sceneState
        });
      }
    }
  }

  componentWillUnmount() {
    this.cancelToken.cancel();
  }

  render() {
    const sceneState = this.state.sceneState;

    if (!sceneState) {
      return null;
    }

    return (
      <ol>
        {sceneState.messages().map(message => (
          <li key={message}>{message}</li>
        ))}
      </ol>
    );
  }
}
