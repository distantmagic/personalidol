import type MD2CharacterAnimations from "src/framework/types/MD2CharacterAnimations";

type MD2CharacterConfig = {
  readonly animations: MD2CharacterAnimations;
  readonly baseUrl: string;
  readonly body: string;
  readonly skins: ReadonlyArray<string>;
  readonly weapons: [string, string];
};

export default MD2CharacterConfig;
