// @flow

import * as React from "react";

import ScrollbarPosition from "../framework/classes/ScrollbarPosition";

type Props = {|
  children: Array<any>,
  className?: string,
  style?: {
    [string]: number | string
  },
  type: string
|};

function updateScrollDelta(ref: HTMLElement, delta: number): void {
  const scrollPosition = new ScrollbarPosition(
    ref.scrollWidth,
    ref.offsetWidth,
    0,
    ref.scrollLeft
  );
  const updatedScrollPosition = scrollPosition.adjust(delta);

  ref.scrollLeft = updatedScrollPosition.scrollOffset;
}

export default function HudToolbarScrollbar(props: Props) {
  const [containerElement, setContainerElement] = React.useState(null);

  React.useEffect(
    function() {
      if (!containerElement) {
        return;
      }

      const element = containerElement;

      const onWheelBound = function(evt: WheelEvent) {
        evt.preventDefault();

        updateScrollDelta(element, evt.deltaX);
      };

      element.addEventListener("wheel", onWheelBound, false);
      updateScrollDelta(element, 0);

      return function() {
        element.removeEventListener("wheel", onWheelBound);
      };
    },
    [containerElement]
  );

  return React.createElement(
    props.type,
    {
      className: props.className,
      style: props.style,
      ref: setContainerElement
    },
    [props.children]
  );
}

HudToolbarScrollbar.defaultProps = {
  type: "div"
};
