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

export default function HudToolbarScrollbar(props: Props) {
  const containerRef = React.useRef(null);

  function onWheel(evt: WheelEvent): void {
    evt.preventDefault();

    const element = containerRef.current;

    if (element) {
      updateScroll(evt, element);
    }
  }

  function updateScroll(evt: WheelEvent, ref: HTMLElement): void {
    updateScrollDelta(ref, evt.deltaX);
  }

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

  React.useEffect(function() {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    element.addEventListener("wheel", onWheel, false);
    updateScrollDelta(element, 0);

    return function(boundElement: HTMLElement) {
      boundElement.removeEventListener("wheel", onWheel);
    }.bind(null, element);
  });

  return React.createElement(
    props.type,
    {
      className: props.className,
      style: props.style,
      ref: containerRef
    },
    [props.children]
  );
}

HudToolbarScrollbar.defaultProps = {
  type: "div"
};
