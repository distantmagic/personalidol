// @flow

import * as React from "react";

import Character from "../framework/classes/Entity/Person/Character";
import ModalCharacterInventorySlot from "./ModalCharacterInventorySlot";

type Props = {|
  character: Character,
|};

export default function ModalCharacterInventory(props: Props) {
  const slots = [
    "back",
    "belt",
    "feet",
    "head",
    "larm",
    "legs",
    "lhand",
    "lring",
    "neck",
    "rarm",
    "rhand",
    "rring",
    "shield",
    "torso",
    "utility1",
    "utility2",
    "utility3",
    "utility4",
    "utility5",
    "weapon",
  ];

  return (
    <div className="dd__modal__character__inventory">
      <div className="dd__modal__character__inventory__paperdoll">
        {slots.map(slot => (
          <ModalCharacterInventorySlot key={slot} slot={slot} />
        ))}
      </div>
    </div>
  );
}
