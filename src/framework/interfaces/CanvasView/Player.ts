import * as THREE from "three";

import CanvasView from "src/framework/interfaces/CanvasView";
import MD2Character from "src/framework/interfaces/CanvasView/MD2Character";

export default interface Player extends CanvasView {
  getCharacter(): MD2Character;
}
