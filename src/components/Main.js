// @flow

import * as React from "react";

import BusClock from "../framework/classes/BusClock";
import CancelToken from "../framework/classes/CancelToken";
import DialogueLoader from "./DialogueLoader";
import DialogueResourceReference from "../framework/classes/ResourceReference/Dialogue";
import ExpressionBus from "../framework/classes/ExpressionBus";
import ExpressionContext from "../framework/classes/ExpressionContext";
import Person from "../framework/classes/Entity/Person";
import QueryBus from "../framework/classes/QueryBus";
import QueryBusController from "../framework/classes/QueryBusController";

import type { Logger } from "../framework/interfaces/Logger";
import type { QueryBus as QueryBusInterface } from "../framework/interfaces/QueryBus";

type Props = {|
  logger: Logger
|};

type State = {|
  cancelToken: CancelToken,
  expressionBus: ExpressionBus,
  expressionContext: ExpressionContext,
  error: ?Error,
  queryBus: QueryBusInterface,
  queryBusController: QueryBusController
|};

export default class Main extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const queryBus = new QueryBus();

    this.state = {
      cancelToken: new CancelToken(),
      expressionBus: new ExpressionBus(),
      expressionContext: new ExpressionContext(),
      error: null,
      queryBus: queryBus,
      queryBusController: new QueryBusController(new BusClock(), queryBus)
    };
  }

  componentDidCatch(error: Error, errorInfo: Object): void {
    this.setState({
      error: error
    });
  }

  componentDidMount(): void {
    this.state.queryBusController.interval(this.state.cancelToken);
  }

  componentWillUnmount(): void {
    this.state.cancelToken.cancel();
  }

  render() {
    return (
      <div className="dd__container dd__hud dd__hud--dialogue-medium">
        <div className="dd__aside dd__aside--hud" />
        <div className="dd__dialogue dd__dialogue--hud">
          <DialogueLoader
            dialogueResourceReference={
              new DialogueResourceReference("/data/dialogues/umbrux-intro.yml")
            }
            dialogueInitiator={new Person("Laelaps")}
            expressionBus={this.state.expressionBus}
            expressionContext={this.state.expressionContext}
            logger={this.props.logger}
            queryBus={this.state.queryBus}
          />
        </div>
        <div className="dd__scene dd__scene--hud" />
        <div className="dd__statusbar dd__statusbar--hud">
          Thalantyr: szansa na zadanie obrażeń 56%. Intuicja podpowiada ci, że
          będzie przyjaźnie nastawiony.
        </div>
        <div
          className="dd__toolbar dd__toolbar--hud"
          style={{
            "--dd-toolbar-elements": 45
          }}
        >
          <button className="dd__button dd__button--toolbar dd__button--icon dd__button--strength">
            Brutalna siła
          </button>
          <button className="dd__button dd__button--toolbar dd__button--icon dd__button--magic">
            Czar
          </button>
          <button className="dd__button dd__button--toolbar dd__button--icon dd__button--prayer">
            Modlitwa
          </button>
          <button className="dd__button dd__button--toolbar dd__button--icon dd__button--backpack">
            Ekwipunek
          </button>
        </div>
      </div>
    );
  }
}
