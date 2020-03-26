import type Query from "src/framework/interfaces/Query";

type QueryBusOnEnqueuedCallback<T> = (query: Query<T>) => void;

export default QueryBusOnEnqueuedCallback;
