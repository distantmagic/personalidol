# `framework`

Base interfaces and services other paackages rely on.

## Services

1. `EventBus` - global event bus that broadcasts events like mouse wheel use etc.
2. `MainLoop` - main animation loop that allows adding function to be called during the animation window.
3. `MouseObserver` - keeps the state of currently pressed mouse buttons and pointer position.
4. `MouseWheelObserver` - broadcasts event when mouse wheel is used as it's stateless.
5. `PreventDefaultInput` - simple service that disables any interaction with a given DOM element.
6. `ServiceManager` - service bag that starts and stops all added services.
7. `TouchObserver` - keeps the state of currently active touch points, pressure etc.

## Interfaces

1. `Scene.interface` - base properties that should be implemented in the app scene (like main menu, game itself etc).
