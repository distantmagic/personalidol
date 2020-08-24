export function uiOptionsClose(uiMessagePort: MessagePort): void {
  uiMessagePort.postMessage({
    optionsClose: {},
  });
}
