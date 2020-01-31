import ElementPosition from "src/framework/interfaces/ElementPosition";
import EventListenerSet from "src/framework/interfaces/EventListenerSet";
import Observer from "src/framework/interfaces/Observer";
import Positionable from "src/framework/interfaces/Positionable";

export default interface HTMLPositionObserver extends Observer {
  readonly onPositionChange: EventListenerSet<[ElementPosition<"px">]>;
}
