export default interface Objectable<T extends Object> {
  asObject(): T;
}
