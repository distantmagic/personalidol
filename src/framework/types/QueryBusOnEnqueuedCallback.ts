import { Query } from "src/framework/interfaces/Query";

export type QueryBusOnEnqueuedCallback<T> = (query: Query<T>) => void;
