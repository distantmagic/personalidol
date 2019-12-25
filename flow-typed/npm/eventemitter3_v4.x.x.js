// flow-typed signature: b7ab86e40fd87c2d7414d5ceb45ecddb
// flow-typed version: 6347e0da2b/eventemitter3_v3.x.x/flow_>=v0.25.x

declare module "eventemitter3" {
  declare type ListenerFn<T> = (args: T) => mixed;
  declare class EventEmitter {
    static constructor(): EventEmitter;
    static prefixed: string | boolean;
    eventNames(): (string | Symbol)[];
    listeners(event: string | Symbol): ListenerFn<any>[];
    listenerCount(event: string | Symbol): number;
    on<T>(event: string | Symbol, listener: ListenerFn<T>, context?: any): this;
    addListener<T>(event: string | Symbol, listener: ListenerFn<T>, context?: any): this;
    once<T>(event: string | Symbol, listener: ListenerFn<T>, context?: any): this;
    removeAllListeners(event?: string | Symbol): this;
    removeListener<T>(event: string | Symbol, listener?: ListenerFn<T>, context?: any, once?: boolean): this;
    off<T>(event: string | Symbol, listener?: ListenerFn<T>, context?: any, once?: boolean): this;
    emit<T>(event: string, params?: T): this;
  }
  declare module.exports: Class<EventEmitter>;
}

// Filename aliases
declare module "eventemitter3/index" {
  declare module.exports: $Exports<"eventemitter3">;
}
declare module "eventemitter3/index.js" {
  declare module.exports: $Exports<"eventemitter3">;
}
