import type Query from "src/framework/interfaces/Query";

export default interface QueryBuilder<T extends string, U extends Query<any>> {
  build(ref: T): Promise<U>;
}
