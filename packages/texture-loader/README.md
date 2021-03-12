# `texture-loader`

Loads textures either using `createImageBitmap` or via the main browser thread.
It is designed to allow sending textures via `MessageChannel` and preferably
loading textures in the worker thread.
