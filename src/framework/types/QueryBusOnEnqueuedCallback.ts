import { Query } from "../interfaces/Query";

export type QueryBusOnEnqueuedCallback<T> = (query: Query<T>) => void;
