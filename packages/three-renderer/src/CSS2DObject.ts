import { Object3D } from "three/src/core/Object3D";

import type { CSS2DObject as ICSS2DObject } from "./CSS2DObject.interface";

export class CSS2DObject extends Object3D implements ICSS2DObject {
  public isCSS2DObject: true = true;

  constructor(domMessagePort: MessagePort) {
    super();

    // this.addEventListener( 'removed', function (this: CSS2DObject) {
    //   this.traverse( function ( object: Object3D ) {
    //     if ( object instanceof CSS2DObject && object.element instanceof HTMLElement && object.element.parentNode !== null ) {
    //       object.element.parentNode.removeChild( object.element );
    //     }
    //   } );
    // } );
  }
}
