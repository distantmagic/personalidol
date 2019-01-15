// @flow

import * as React from "react";

import DialogueAnswer from "./DialogueAnswer";
import DialogueMessage from "../framework/classes/DialogueMessage";

import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { ExpressionContext } from "../framework/interfaces/ExpressionContext";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {
  answer: DialogueMessage,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  queryBus: QueryBus
};

type State = {
  actor: ?string,
  prompt: ?string
};

export default class DialogueAnswerController extends React.Component<
  Props,
  State
> {
  state = {
    actor: null,
    prompt: null
  };

  async componentDidMount() {
    this.setState({
      actor: await this.props.answer.actor(),
      prompt: await this.props.answer.prompt()
    });
  }

  render() {
    const { actor, prompt } = this.state;

    if ("string" !== typeof actor || "string" !== typeof prompt) {
      return <div>Loading...</div>;
    }

    return (
      <DialogueAnswer
        actor={actor}
        answer={this.props.answer}
        prompt={prompt}
      />
    );
  }
}
