export function uiMap(uiMessagePort: MessagePort, mapName: string): void {
  uiMessagePort.postMessage({
    map: {
      mapName: mapName,
    },
  });
}
