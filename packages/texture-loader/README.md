# `texture-loader`

Loads textures either using `createImageBitmap` or via the main browser thread. It is designed to allow sending textures via `MessageChannel` and preferably loading textures in the worker thread.

## Services

1. `AtlasService` - combines several textures into the one bigger texture atlas.
2. `DOMTextureService` - loads textures in the DOM thread using 2D canvas. Only used if `createImageBitmap` is not supported.
