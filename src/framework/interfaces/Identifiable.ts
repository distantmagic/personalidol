export default interface Identifiable {
  name(): Promise<string>;
}
