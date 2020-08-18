# `three-modules`

This package contains modified or just repackaged THREE example scripts.

Primarily those are loaders and shaders modified to work within the dedicated
worker scope or changed to use specific imports instead of importing the entire
THREE library. This can spare more thann 600kB of scripts from loading.
