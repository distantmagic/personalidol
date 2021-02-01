import { Matrix4 } from "three/src/math/Matrix4";
import { Object3D } from "three/src/core/Object3D";
import { Vector3 } from "three/src/math/Vector3";

import { isCSS2DObject } from "./isCSS2DObject";

import type { Camera } from "three/src/cameras/Camera";
import type { Scene } from "three/src/scenes/Scene";

import type { MessageDOMUIRender } from "@personalidol/dom-renderer/src/MessageDOMUIRender.type";

import type { CSS2DObject } from "./CSS2DObject.interface";
import type { CSS2DRenderer as ICSS2DRenderer } from "./CSS2DRenderer.interface";

const _vec = new Vector3();
const _vecTmpA = new Vector3();
const _vecTmpB = new Vector3();

export function CSS2DRenderer(domMessagePort: MessagePort): ICSS2DRenderer {
  let _height: number = 0;
  let _heightHalf: number = 0;
  let _width: number = 0;
  let _widthHalf: number = 0;
  let i: number = 0;

  let _previousDistanceToCameraSquared: number = 0;
  let _previousIsRendered: boolean = false;
  let _previousTranslateX: number = 0;
  let _previousTranslateY: number = 0;
  let _previousVisible: boolean = false;

  const viewMatrix = new Matrix4();
  const viewProjectionMatrix = new Matrix4();

  const renderer: ICSS2DRenderer = Object.freeze({
    getSize: getSize,
    render: render,
    setSize: setSize,
  });

  function _renderObject(object: CSS2DObject, scene: Scene, camera: Camera) {
    // @ts-ignore
    object.onBeforeRender(renderer, scene, camera);

    _vec.setFromMatrixPosition(object.matrixWorld);
    _vec.applyMatrix4(viewProjectionMatrix);

    _previousDistanceToCameraSquared = object.state.distanceToCameraSquared;
    _previousIsRendered = object.isRendered;
    _previousTranslateX = object.state.translateX;
    _previousTranslateY = object.state.translateY;
    _previousVisible = object.state.visible;

    object.isRendered = true;
    object.state.distanceToCameraSquared = _getDistanceToSquared(camera, object);
    // @ts-ignore
    object.state.cameraFar = camera.far || 0;
    object.state.translateX = _vec.x * _widthHalf + _widthHalf;
    object.state.translateY = -1 * _vec.y * _heightHalf + _heightHalf;

    // prettier-ignore
    if ( object.state.translateX < 0
      || object.state.translateY < 0
      || object.state.translateX > _width
      || object.state.translateY > _height
    ) {
      object.state.visible = false;
    } else {
      object.state.visible = object.visible && _vec.z >= -1 && _vec.z <= 1;
    }

    // prettier-ignore
    object.isDirty = (
      (!object.state.visible && !_previousVisible)
      || _previousDistanceToCameraSquared !== object.state.distanceToCameraSquared
      || _previousIsRendered !== object.isRendered
      || _previousTranslateX !== object.state.translateX
      || _previousTranslateY !== object.state.translateY
      || _previousVisible !== object.state.visible
    );

    // @ts-ignore
    object.onAfterRender(renderer, scene, camera);
  }

  function _getDistanceToSquared(object1: Object3D, object2: Object3D): number {
    _vecTmpA.setFromMatrixPosition(object1.matrixWorld);
    _vecTmpB.setFromMatrixPosition(object2.matrixWorld);

    return _vecTmpA.distanceToSquared(_vecTmpB);
  }

  function _filterAndFlatten(scene: Scene): Array<CSS2DObject> {
    const result: Array<CSS2DObject> = [];

    scene.traverse(function (object: Object3D) {
      if (isCSS2DObject(object)) {
        result.push(object);
      }
    });

    return result;
  }

  function _sortObjectsByDistance(a: CSS2DObject, b: CSS2DObject) {
    const distanceA = a.state.distanceToCameraSquared;
    const distanceB = b.state.distanceToCameraSquared;

    return distanceA - distanceB;
  }

  function _zOrder(css2DObjects: Array<CSS2DObject>, scene: Scene) {
    const sorted = css2DObjects.sort(_sortObjectsByDistance);
    const zMax = sorted.length;

    for (i = 0; i < zMax; i++) {
      sorted[i].state.zIndex = zMax - i;
    }
  }

  function getSize() {
    return {
      width: _width,
      height: _height,
    };
  }

  function setSize(width: number, height: number) {
    _height = height;
    _heightHalf = _height / 2;
    _width = width;
    _widthHalf = _width / 2;
  }

  /**
   * `updateMatrices` can be `false` because 3D renderer might just have done
   * the same thing in the same tick.
   */
  function render(scene: Scene, camera: Camera, updateMatrices: boolean) {
    if (updateMatrices && scene.autoUpdate === true) {
      scene.updateMatrixWorld();
    }

    if (updateMatrices && camera.parent === null) {
      camera.updateMatrixWorld();
    }

    viewMatrix.copy(camera.matrixWorldInverse);
    viewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, viewMatrix);

    const css2DObjects: Array<CSS2DObject> = _filterAndFlatten(scene);

    for (let object of css2DObjects) {
      _renderObject(object, scene, camera);
    }

    _zOrder(css2DObjects, scene);

    const renderBatch: Array<MessageDOMUIRender> = [];

    for (let object of css2DObjects) {
      if (object.isDirty) {
        renderBatch.push(<MessageDOMUIRender>{
          element: object.element,
          id: object.uuid,
          props: {
            objectProps: object.props,
            rendererState: object.state,
          },
        });
        object.isDirty = false;
      }
    }

    if (renderBatch.length < 1) {
      return;
    }

    domMessagePort.postMessage({
      renderBatch: renderBatch,
    });
  }

  return renderer;
}
