export function isCustomEvent(evt: Event): evt is CustomEvent {
  if (evt.isTrusted) {
    // Definitely not a CustomEvent.
    return false;
  }

  return evt instanceof CustomEvent;
}
