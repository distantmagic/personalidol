# `three-modules`

This repo contains modified or repackaged THREE example scripts.

Primarily three things are done to those scripts:

1. They are modified to work within the offscreen worker. This especially
applies to loaders. Instead of just returning mesh, they return typed arrays
so they can be transfered into another place via Transferables and postMessage.
2. Resources disposing is implemented wherever it was misssing. For example
postprocessing helpers did not dispose resources in mose cases which would lead
to memory leaks when using them.
3. Examples use minimal imports directly from threejs library instead of
including the entire THREE bundle. This can prevent about 500-600kB of unused
scripts to be loaded.
