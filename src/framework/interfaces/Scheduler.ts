import EventListenerSet from "src/framework/interfaces/EventListenerSet";

export default interface Scheduler {
  readonly draw: EventListenerSet<[number]>;
  readonly update: EventListenerSet<[number]>;
}
