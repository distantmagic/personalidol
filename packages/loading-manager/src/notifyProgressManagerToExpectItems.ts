export function notifyProgressManagerToExpectItems(progressMessagePort: MessagePort, expectAtLeast: number): void {
  progressMessagePort.postMessage({
    expectAtLeast: expectAtLeast,
  });
}
