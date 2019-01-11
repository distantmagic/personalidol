// @flow

import * as React from "react";

import DialogueAnswerController from "./DialogueAnswerController";
import DialogueMessage from "../framework/classes/DialogueMessage";
import { default as DialogueModel } from "../framework/classes/Dialogue";

import type { Collection } from "../framework/interfaces/Collection";
import type { ExpressionBus } from "../framework/interfaces/ExpressionBus";
import type { QueryBus } from "../framework/interfaces/QueryBus";

type Props = {
  actor: string,
  answers: Collection<DialogueMessage>,
  dialogue: DialogueModel,
  expressionBus: ExpressionBus,
  message: DialogueMessage,
  prompt: string,
  queryBus: QueryBus
};

type State = {};

export default class Dialogue extends React.Component<Props, State> {
  render() {
    return (
      <div>
        <strong>{this.props.actor}</strong>
        {" - "}
        {this.props.prompt}
        <ol>
          {this.props.answers.map(answer => (
            <li key={answer.key()}>
              <DialogueAnswerController
                answer={answer}
                expressionBus={this.props.expressionBus}
                queryBus={this.props.queryBus}
              />
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
