export function uiOptionsOpen(uiMessagePort: MessagePort): void {
  uiMessagePort.postMessage({
    optionsOpen: {},
  });
}
