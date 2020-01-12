import { CanvasView } from "src/framework/interfaces/CanvasView";
import { Resizeable } from "src/framework/interfaces/Resizeable";

export interface CanvasController extends CanvasView, Resizeable<"px"> {}
