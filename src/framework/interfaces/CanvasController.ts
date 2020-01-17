import Animatable from "src/framework/interfaces/Animatable";
import Disposable from "src/framework/interfaces/Disposable";
import Resizeable from "src/framework/interfaces/Resizeable";

export default interface CanvasController extends Animatable, Disposable, Resizeable<"px"> {}
