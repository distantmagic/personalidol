// @flow

import * as React from "react";
import autoBind from "auto-bind";

import ScrollbarPosition from "../framework/classes/ScrollbarPosition";

type Props = {|
  children: Array<any>,
  className?: string,
  style?: {
    [string]: number | string
  },
  type: string
|};

type State = {||};

export default class HudToolbarScrollbar extends React.Component<Props, State> {
  containerRef: ?HTMLElement;

  static defaultProps = {
    type: "div"
  };

  constructor(props: Props) {
    super(props);

    autoBind.react(this);
  }

  componentWillUnmount() {
    this.unlisten(this.containerRef);
  }

  setContainerRef(ref: ?HTMLElement): void {
    this.unlisten(this.containerRef);

    if (!ref) {
      this.containerRef = null;

      return;
    }

    this.containerRef = ref;

    ref.addEventListener("wheel", this.onWheel, false);
    this.updateScrollDelta(0, ref);
  }

  onWheel(evt: WheelEvent): void {
    evt.preventDefault();

    const currentRef = this.containerRef;

    if (currentRef) {
      this.updateScroll(evt, currentRef);
    }
  }

  unlisten(ref: ?HTMLElement): void {
    if (ref) {
      ref.removeEventListener("wheel", this.onWheel);
    }
  }

  updateScroll(evt: WheelEvent, ref: HTMLElement): void {
    this.updateScrollDelta(evt.deltaX, ref);
  }

  updateScrollDelta(delta: number, ref: HTMLElement): void {
    const scrollPosition = new ScrollbarPosition(
      ref.scrollWidth,
      ref.offsetWidth,
      ref.scrollLeft
    );
    const updatedScrollPosition = scrollPosition.adjust(delta);

    ref.scrollLeft = updatedScrollPosition.scrollLeft;
  }

  render() {
    return React.createElement(
      this.props.type,
      {
        className: this.props.className,
        style: this.props.style,
        ref: this.setContainerRef
      },
      [this.props.children]
    );
  }
}
