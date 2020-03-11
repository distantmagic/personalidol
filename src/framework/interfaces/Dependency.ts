export default interface Dependency<T, U extends {} = {}> {
  new (params?: U): T;

  reuse(params?: U): T;
}
