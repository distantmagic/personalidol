import { Query } from "./Query";

export interface QueryBuilder<T extends string, U extends Query<any>> {
  build(ref: T): Promise<U>;
}
