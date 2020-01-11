// @flow strict

export type MD2CharacterConfig = {|
  +animations: {|
    attack: string,
    crouchAttack: string,
    crouchIdle: string,
    crouchMove: string,
    idle: string,
    jump: string,
    move: string,
  |},
  +baseUrl: string,
  +body: string,
  +skins: $ReadOnlyArray<string>,
  +weapons: [string, string],
|};
