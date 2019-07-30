// @flow

import * as React from "react";

import ScrollbarPosition from "../framework/classes/ScrollbarPosition";

type Props = {|
  children: $ReadOnlyArray<any>,
|};

function updateScrollDelta(ref: HTMLElement, delta: number): void {
  const scrollPosition = new ScrollbarPosition(ref.scrollWidth, ref.offsetWidth, 0, ref.scrollLeft);
  const updatedScrollPosition = scrollPosition.adjust(delta);

  ref.scrollLeft = updatedScrollPosition.scrollOffset;
}

export default function HudToolbarScrollbar(props: Props) {
  const [containerElement, setContainerElement] = React.useState<?HTMLElement>(null);

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

  return (
    <div
      className="dd__frame dd__toolbar dd__toolbar--hud"
      ref={setContainerElement}
      style={{
        "--dd-toolbar-elements": props.children.length,
      }}
    >
      {props.children}
      <div className="dd__toolbar__scroll-indicator" />
    </div>
  );
}
