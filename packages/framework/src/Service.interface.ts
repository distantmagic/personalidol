export interface Service {
  readonly name: string;

  start(): void;

  stop(): void;
}
