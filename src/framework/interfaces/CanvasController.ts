import { CanvasView } from "./CanvasView";
import { Resizeable } from "./Resizeable";

export interface CanvasController extends CanvasView, Resizeable<"px"> {}
