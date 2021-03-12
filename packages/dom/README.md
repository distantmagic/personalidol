# `dom-renderer`

This package contains utilities that handle DOM rendering. By default it's the  user interface (menus, buttons, etc), as it is often impractical to create those in the 3D context.

## Services

1. `FontPreloadService` - receives messages via message channel and loads fonts in the main thread (the one with access to DOM) so it's possible to request font preload from worker thread.

## Interfaces

1. `DOMUIController` - base iterface that handles DOM rendering. It should be implemented in the application itself.
