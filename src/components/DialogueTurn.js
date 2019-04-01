// @flow

import { Map } from "immutable";

import * as React from "react";
import ReactMarkdown from "react-markdown";

import DialogueAnswer from "./DialogueAnswer";
import DialogueSpinner from "./DialogueSpinner";
import HTMLElementSize from "../framework/classes/HTMLElementSize";
import ScrollbarPosition from "../framework/classes/ScrollbarPosition";

import type { DialogueMessage } from "../framework/interfaces/DialogueMessage";
import type { DialogueTurn as DialogueTurnInterface } from "../framework/interfaces/DialogueTurn";
import type { Logger } from "../framework/interfaces/Logger";

type Props = {|
  dialogueTurn: DialogueTurnInterface,
  logger: Logger,
  onAnswerClick: DialogueMessage => any,
  onDialogueEnd: () => any
|};

function updateScrollDelta(
  ref: HTMLElement,
  refSize: HTMLElementSize,
  setScrollPercentage
): void {
  const scrollPosition = new ScrollbarPosition(
    ref.scrollHeight,
    ref.offsetHeight,
    28,
    ref.scrollTop
  );
  setScrollPercentage(Math.min(100, scrollPosition.scrollPercentage));
}

function useScrollPercentageState() {
  const [scrollPercentage, setScrollPercentage] = React.useState(0);
  const [containerElement, setContainerElement] = React.useState(null);

  React.useEffect(
    function() {
      if (!containerElement) {
        return;
      }

      const containerHTMLElementSize = new HTMLElementSize(containerElement);
      const onWheelBound = updateScrollDelta.bind(
        null,
        containerElement,
        containerHTMLElementSize,
        setScrollPercentage
      );

      containerElement.addEventListener("wheel", onWheelBound, false);
      updateScrollDelta(
        containerElement,
        containerHTMLElementSize,
        setScrollPercentage
      );

      return function(boundElement: HTMLElement) {
        boundElement.removeEventListener("wheel", onWheelBound);
      }.bind(null, containerElement);
    },
    [containerElement]
  );

  return [scrollPercentage, setContainerElement];
}

export default function DialogueTurn(props: Props) {
  const [scrollPercentage, setContainerElement] = useScrollPercentageState();
  const [state, setState] = React.useState({
    actor: null,
    answers: Map(),
    illustration: null,
    isLoading: true,
    prompt: null
  });

  function onDialogueEndClick(evt: SyntheticEvent<any>): void {
    evt.preventDefault();

    props.onDialogueEnd();
  }

  React.useEffect(
    function() {
      Promise.all([
        props.dialogueTurn.actor(),
        props.dialogueTurn.answers(),
        props.dialogueTurn.getIllustration(),
        props.dialogueTurn.prompt()
      ])
        .then(([actor, answers, illustration, prompt]) => {
          setState({
            actor: actor,
            answers: answers,
            illustration: illustration,
            isLoading: false,
            prompt: prompt
          });
        })
        .catch(props.logger.error);
    },
    [props.dialogueTurn]
  );

  if (state.isLoading) {
    return <DialogueSpinner label="Loading dialogue prompt..." />;
  }

  return (
    <div className="dd__dialogue dd__dialogue--hud dd__frame">
      <div className="dd__dialogue__scrollframe" ref={setContainerElement}>
        <div className="dd__dialogue__turn">
          {state.illustration && (
            <div className="dd__dialogue__turn__illustration">
              <img
                alt="Illustration"
                className="dd__dialogue__turn__illustration__image"
                src={`/assets/image-manuscript-header.png`}
              />
            </div>
          )}
          <h1 className="dd__dialogue__turn__title">Jaskinia pustelnika</h1>
          <div className="dd__dialogue__turn__prompt dd-tp__formatted-text">
            <div className="dd__dialogue__turn__actor">{state.actor}</div>
            <ReactMarkdown source={state.prompt} />
          </div>
          <hr className="dd__dialogue__hr" />
          {state.answers.isEmpty() ? (
            <button
              className="dd__button dd__button--dialogue-turn-end"
              onClick={onDialogueEndClick}
            >
              Zakończ dialog
            </button>
          ) : (
            <ol className="dd__dialogue__turn__answers">
              {state.answers
                .toSet()
                .toArray()
                .map(dialogueMessage => (
                  <li
                    className="dd__dialogue__turn__answer"
                    key={dialogueMessage.key()}
                  >
                    <DialogueAnswer
                      dialogueMessage={dialogueMessage}
                      logger={props.logger}
                      onAnswerClick={props.onAnswerClick}
                    />
                  </li>
                ))}
            </ol>
          )}
        </div>
        <div
          className="dd__dialogue__scrollframe__scrollbar"
          style={{
            "--dd-scroll-percentage-normalized": scrollPercentage / 100
          }}
        >
          <div className="dd__dialogue__scrollframe__scrollbar__indicator" />
        </div>
      </div>
    </div>
  );
}
