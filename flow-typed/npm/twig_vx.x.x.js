// flow-typed signature: f5fb6ba78f21baacf05266af1e3beb41
// flow-typed version: <<STUB>>/twig_v^1.13.3/flow_v0.98.0

declare module "twig" {
  declare type TwigRendererData = {
    [string]: any
  };

  declare type TwigRenderer = {|
    renderAsync: (data: TwigRendererData) => Promise<string>
  |};

  declare type Twig = {|
    twig: ({|
      data: string,
      rethrow: boolean,
      strict_variables: boolean
    |}) => TwigRenderer
  |};

  declare module.exports: Twig;
}
