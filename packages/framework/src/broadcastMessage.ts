let i = 0;

export function broadcastMessage(messagePorts: Array<MessagePort>, message: any): void {
  for (i = 0; i < messagePorts.length; i += 1) {
    messagePorts[i].postMessage(message);
  }
}
