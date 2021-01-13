export function resetProgressManagerState(progressMessagePort: MessagePort): void {
  progressMessagePort.postMessage({
    reset: true,
  });
}
