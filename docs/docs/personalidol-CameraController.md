---
id: personalidol-CameraController
title: CameraController
slug: /personalidol/CameraController
---

`CameraController` changes the camera position and type in response to user
settings and actions. It also updates the camera aspect (for perspective
camera) or frustum size (for orthographic camera) in response to changes in the
[`DimensionsState`](framework-DimensionsState.md).

It is aware of [`UserSettings`](personalidol-UserSettings.md) and is able to
switch between
[`THREE.PerspectiveCamera`](https://threejs.org/docs/?q=perspe#api/en/cameras/PerspectiveCamera)
and
[`THREE.OrthographicCamera`](https://threejs.org/docs/?q=ortho#api/en/cameras/OrthographicCamera).

Camera state is not updated immediately after
[`UserSettings`](personalidol-UserSettings.md) are changed. Instead it updates
the camera type and settings on the next available frame. `CameraController`
should be updated before the scene is rendered.

## Behaviors

See the base [`Mountable`](framework-Mountable.interface.md) and [`Pauseable`](framework-Pauseable.interface.md) interfaces for all methods and properties.

<table>
  <tbody>
    <tr>
      <th>Pauseable</th>
      <td>
        If the <code>CameraController</code> is paused and updated, it does not
        respond to the user input, but it still updates camera frustum size or
        aspect in case dimensions state changes.
      </td>
    </tr>
    <tr>
      <th>MainLoopUpdatable</th>
      <td>
        During each tick, <code>CameraController</code> (in this order):
        <ol>
          <li>
            Checks <code>UserSettings</code> if a camera projection changed and
            switches the camera type.
          </li>
          <li>
            Updates camera aspect or frustum size based on dimensions
            state.
          </li>
          <li>
            Checks if any human input (keyboard, mouse, touch, etc) that might
            affect the camera is pressed and reacts accordingly (by zooming,
            panning, etc). It uses damping for smoother movement by default,
            but it is possible skip it and move camera immediately to the end
            state.
          </li>
          <li>
            Reorients the camera to look at the specified position.
          </li>
        </ol>
      </td>
    </tr>
    <tr>
      <th>Mountable</th>
      <td>
        After mounting, <code>CameraController</code> starts listening to the
        event bus for user input events like mouse wheel zoom or gestures that
        may influence the camera position.
      </td>
    </tr>
  </tbody>
</table>

## Constructor

```typescript
import type { Logger } from "loglevel";

import type { EventBus } from "@personalidol/framework/src/EventBus.interface";

import type { CameraController as ICameraController } from "@personalidol/personalidol/src/CameraController.interface";
import type { UserSettings } from "@personalidol/personalidol/src/UserSettings.type";

type CameraControllerConstructor = (
  logger: Logger,
  userSettings: UserSettings,
  dimensionsState: Uint32Array,
  keyboardState: Uint8Array,
  eventBus: EventBus,
) => ICameraController;
```

## Properties

### `.camera`: [`THREE.OrthographicCamera`](https://threejs.org/docs/?q=ortho#api/en/cameras/OrthographicCamera) | [`THREE.PerspectiveCamera`](https://threejs.org/docs/?q=perspe#api/en/cameras/PerspectiveCamera) *readonly*

Contains a reference to the currently used camera.

### `.needsImmediateMove`: `boolean`

Settings this causes the `CameraController` to skip damping and move
immediately to the target during the next frame. After camera moves to the
target it will use damping again during the next movement and this property
will reset to `false`. You need to set it to `true` everytime you want the
camera to move immediately.

### `.position`: [`THREE.Vector3`](https://threejs.org/docs/?q=vector3#api/en/math/Vector3)

Sets the camera desired position. `CameraController` will use damping (smooth
movement) to get to that position during a series of frames. You can change
the position anytime, you don't have to check if `CameraController` is already
moving, it will adjust automatically.

### `.state`: [`CameraControllerState`](personalidol-CameraControllerState.type.md) *readonly*

All state properties are read-only and should not be changed from outside the
`CameraController`.


## Methods

### `.resetZoom()`: `void`

Resets zoom to the initial level.
