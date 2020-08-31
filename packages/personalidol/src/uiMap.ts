export function uiMap(domMessagePort: MessagePort, mapName: string): void {
  domMessagePort.postMessage({
    map: {
      mapName: mapName,
    },
  });
}
