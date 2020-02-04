import ElementPositionUnit from "src/framework/enums/ElementPositionUnit";

import Animatable from "src/framework/interfaces/Animatable";
import Disposable from "src/framework/interfaces/Disposable";
import Positionable from "src/framework/interfaces/Positionable";
import Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasController extends Animatable, Disposable, Positionable<ElementPositionUnit.Px>, Resizeable<ElementPositionUnit.Px> {}
