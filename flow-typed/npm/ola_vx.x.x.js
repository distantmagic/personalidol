declare module "ola" {
  declare export type Ola<T> = {|
    ...T;

    set(T): void;
  |};

  declare function OlaConstructor<T>(initial: T, time?: number): Ola<T>;

  declare function OlaConstructor(initial: number, time?: number): Ola<{|
    value: number;
  |}>;

  declare module.exports: typeof OlaConstructor;
}
