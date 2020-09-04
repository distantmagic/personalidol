import { Component } from "preact";

type Props = {
  uiRootElement: HTMLElement;
  webComponent: null | HTMLElement;
};

function _mustBeHTMLElement(element: null | HTMLElement): HTMLElement {
  if (!element) {
    throw new Error("Web component element is not defined.");
  }

  return element;
}

export class WebComponent extends Component<Props> {
  componentDidMount() {
    this.props.uiRootElement.appendChild(_mustBeHTMLElement(this.props.webComponent));
  }

  componentWillUnmount() {
    this.props.uiRootElement.removeChild(_mustBeHTMLElement(this.props.webComponent));
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}
