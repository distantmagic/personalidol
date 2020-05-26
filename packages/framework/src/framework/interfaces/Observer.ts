export default interface Observer {
  disconnect(): void;

  observe(): void;
}
