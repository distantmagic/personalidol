// @flow

import * as React from "react";
import classnames from "classnames";

import type { InventorySlotEnum } from "../framework/types/InventorySlotEnum";

type Props = {|
  slot: InventorySlotEnum
|};

export default function HudModalCharacterInventorySlot(props: Props) {
  return (
    <div
      className={classnames(
        "dd__frame",
        "dd__frame--inset",
        "dd__frame--inventory-slot",
        "dd__modal__character__inventory__slot",
        `dd__modal__character__inventory__slot--${props.slot}`,
        {
          "dd__modal__character__inventory__slot--active":
            "weapon" === props.slot
        }
      )}
    >
      <div className="dd__modal__character__inventory__slot__tooltip dd__tooltip">
        {props.slot}
      </div>
    </div>
  );
}
