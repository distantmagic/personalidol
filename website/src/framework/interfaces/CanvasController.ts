import type ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import type Animatable from "src/framework/interfaces/Animatable";
import type Disposable from "src/framework/interfaces/Disposable";
import type Positionable from "src/framework/interfaces/Positionable";
import type Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasController extends Animatable, Disposable, Positionable<ElementPositionUnit.Px>, Resizeable<ElementPositionUnit.Px> {}
