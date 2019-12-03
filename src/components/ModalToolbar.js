// @flow

import * as React from "react";
import { NavLink } from "react-router-dom";

type Props = {|
  label: ?string,
|};

export default React.memo<Props>(function ModalToolbar(props: Props) {
  return (
    <div className="dd__modal__toolbar">
      <span>{props.label}</span>
      <NavLink to="/">Zamknij</NavLink>
    </div>
  );
});
