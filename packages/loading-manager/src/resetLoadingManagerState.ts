export function resetLoadingManagerState(progressMessagePort: MessagePort): void {
  progressMessagePort.postMessage({
    reset: true,
  });
}
