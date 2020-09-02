# `loading-manager`

This package contains utilities for both monitoring loading progress and managing the loading process and lifecycle of app compontns.

## Services

1. `Director` - manages scene lifecycle and is able to replace one scene with another.
2. `LoadingManager` - aggregates all the loading data from other services and workers. It is designed to run inside the dedicated worker and collect all the loading data via message channels.
3. `SceneLoader` - switches between loading screen scene and the target scene after it's loaded.
