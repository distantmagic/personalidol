// @flow

import * as React from "react";
import { NavLink } from "react-router-dom";

type Props = {|
  title: string,
|};

export default React.memo<Props>(function ModalToolbar(props: Props) {
  return (
    <div className="dd__modal__toolbar">
      <span className="dd__modal__toolbar__title">{props.title}</span>
      <NavLink to="/">Zamknij</NavLink>
    </div>
  );
});
