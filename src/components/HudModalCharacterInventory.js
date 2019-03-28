// @flow

import * as React from "react";
import upperFirst from "lodash/upperFirst";

import type { Match } from "react-router";

type Props = {|
  match: Match
|};

export default function HudModalCharacterInventory(props: Props) {
  const characterId = String(props.match.params.characterId);
  const characterName = upperFirst(characterId);

  return (
    <div className="dd__frame dd__modal__character">
      <div className="dd__modal__character__avatar">
        <img
          alt="portrait"
          className="dd__modal__character__avatar__image"
          src={`/assets/portrait-${characterId}.jpg`}
        />
      </div>
      <div className="dd__modal__character__name">{characterName}</div>
    </div>
  );
}
