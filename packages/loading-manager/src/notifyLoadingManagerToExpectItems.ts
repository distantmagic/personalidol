export function notifyLoadingManagerToExpectItems(progressMessagePort: MessagePort, expectAtLeast: number): void {
  progressMessagePort.postMessage({
    expectAtLeast: expectAtLeast,
  });
}
