export function uiNavigateToMap(uiMessagePort: MessagePort, filename: string): void {
  uiMessagePort.postMessage({
    navigateToMap: {
      filename: filename,
    },
  });
}
