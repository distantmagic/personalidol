declare module "ola" {
  declare export interface Ola {
    value: number;
  }

  declare function OlaConstructor(initial: number, time?: number): Ola;

  declare module.exports: typeof OlaConstructor;
}
