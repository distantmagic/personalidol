export type MD2GeometryParts = {
  animations: {
    [key: string]: string;
  };
  body: string;
  skins: Array<string>;
  weapons: Array<[string, string]>;
};
