# `three-css2d-renderer`

Custom implementation of `three` `CSS2DRenderer` that is capable of running
in the worker thread. Instead of rendering directly to DOM, it renders views
supported by `dom-renderer` package and communicates via shared memory and
message channels.
