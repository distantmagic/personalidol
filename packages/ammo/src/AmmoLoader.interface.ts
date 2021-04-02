/// <reference types="@types/ammo.js" />

export interface AmmoLoader {
  loadWASM(): Promise<typeof Ammo>;
}
