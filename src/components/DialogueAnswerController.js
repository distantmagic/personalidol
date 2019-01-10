// @flow

import * as React from "react";

import DialogueAnswer from "./DialogueAnswer";
import DialogueMessage from "../framework/classes/DialogueMessage";
import QueryBus from "../framework/classes/QueryBus";

type Props = {
  answer: DialogueMessage,
  queryBus: QueryBus
};

type State = {
  prompt: ?string
};

export default class DialogueAnswerController extends React.Component<
  Props,
  State
> {
  state = {
    prompt: null
  };

  async componentDidMount() {
    this.setState({
      prompt: await this.props.answer.prompt(this.props.queryBus)
    });
  }

  render() {
    const prompt = this.state.prompt;

    if (!prompt) {
      return <div>Loading...</div>;
    }

    return <DialogueAnswer answer={this.props.answer} prompt={prompt} />;
  }
}
