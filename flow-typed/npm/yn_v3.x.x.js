// flow-typed signature: 16e18f452841067c6716a49b2a0f30ca
// flow-typed version: <<STUB>>/yn_v3.0.0/flow_v0.89.0

declare module "yn" {
  declare type Options = {|
    default?: boolean | null,
    lenient?: boolean
  |};

  declare function yn(1, ?Options): true;
  declare function yn(0, ?Options): false;

  declare function yn(true, ?Options): true;
  declare function yn(false, ?Options): false;

  declare function yn(
    string,
    {| default: boolean, lenient?: boolean |}
  ): boolean;
  declare function yn(string, ?Options): boolean | null;

  declare function yn(any, {| default: true, lenient?: boolean |}): true;
  declare function yn(any, {| default: false, lenient?: boolean |}): false;
  declare function yn(any, ?Options): null;

  declare module.exports: typeof yn;
}

// Filename aliases
declare module "yn/index" {
  declare module.exports: $Exports<"yn">;
}

declare module "yn/index.js" {
  declare module.exports: $Exports<"yn">;
}
