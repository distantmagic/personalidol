import * as React from "react";

type Props = {
  comment: string;
  quantity: number;
};

export default React.memo<Props>(function HudSceneOverlayComment(props: Props) {
  return (
    <li>
      {props.comment}
      {props.quantity > 1 ? ` (${props.quantity})` : null}...
    </li>
  );
});
