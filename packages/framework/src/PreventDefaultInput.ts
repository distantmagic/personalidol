import type { PreventDefaultInput as IPreventDefaultInput } from "./PreventDefaultInput.interface";

export function PreventDefaultInput(htmlElement: HTMLElement): IPreventDefaultInput {
  function start(): void {
    htmlElement.addEventListener("contextmenu", _preventDefault);
    htmlElement.addEventListener("mousedown", _preventDefault);
    htmlElement.addEventListener("mouseup", _preventDefault);
    htmlElement.addEventListener("touchend", _preventDefault);
    htmlElement.addEventListener("touchstart", _preventDefault);
    htmlElement.addEventListener("wheel", _preventDefault);
  }

  function stop(): void {
    htmlElement.removeEventListener("contextmenu", _preventDefault);
    htmlElement.removeEventListener("mousedown", _preventDefault);
    htmlElement.removeEventListener("mouseup", _preventDefault);
    htmlElement.removeEventListener("touchend", _preventDefault);
    htmlElement.removeEventListener("touchstart", _preventDefault);
    htmlElement.removeEventListener("wheel", _preventDefault);
  }

  function _preventDefault(evt: MouseEvent | TouchEvent | WheelEvent): void {
    evt.preventDefault();
  }

  return Object.freeze({
    name: "PreventDefaultInput",

    start: start,
    stop: stop,
  });
}
