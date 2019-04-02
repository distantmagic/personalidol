// @flow

import { Map } from "immutable";

import * as React from "react";

import DialogueSpinner from "./DialogueSpinner";
import DialogueTurnPrompt from "./DialogueTurnPrompt";
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
    36,
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

      containerElement.addEventListener("wheel", onWheelBound, {
        capture: true,
        passive: true
      });
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
        <DialogueTurnPrompt
          actor={state.actor}
          answers={state.answers}
          illustration={state.illustration}
          logger={props.logger}
          onAnswerClick={props.onAnswerClick}
          onDialogueEnd={props.onDialogueEnd}
          prompt={state.prompt}
        />
        <div className="dd__dialogue__scrollframe__scrollbar">
          <div
            className="dd__dialogue__scrollframe__scrollbar__indicator"
            style={{
              "--dd-scroll-percentage-normalized": scrollPercentage / 100
            }}
          />
          <div className="dd__dialogue__scrollframe__scrollbar__track">
            <button className="dd__dialogue__scrollframe__scrollbar__track__edge dd__dialogue__scrollframe__scrollbar__track__edge--head" />
            <button className="dd__dialogue__scrollframe__scrollbar__track__edge dd__dialogue__scrollframe__scrollbar__track__edge--tail" />
          </div>
        </div>
      </div>
    </div>
  );
}
