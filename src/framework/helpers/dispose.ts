// @flow

import * as THREE from "three";

import { default as CanvasViewException } from "src/framework/classes/Exception/CanvasView";

import { LoggerBreadcrumbs } from "src/framework/interfaces/LoggerBreadcrumbs";

function material(loggerBreadcrumbs: LoggerBreadcrumbs, material: THREE.Material): void {
  // prettier-ignore
  if ( material instanceof THREE.MeshBasicMaterial
    || material instanceof THREE.MeshDepthMaterial
    || material instanceof THREE.MeshDistanceMaterial
    || material instanceof THREE.MeshLambertMaterial
    || material instanceof THREE.MeshMatcapMaterial
    || material instanceof THREE.MeshPhongMaterial
    || material instanceof THREE.MeshStandardMaterial
    || material instanceof THREE.MeshToonMaterial
    || material instanceof THREE.PointsMaterial
    || material instanceof THREE.SpriteMaterial
  ) {
    const map = material.map;

    if (map) {
      return void texture(loggerBreadcrumbs.add("texture"), map);
    }
  }

  if (material instanceof THREE.ShaderMaterial) {
    // Custom shader materials need to be disposed manually.
    return;
  }

  throw new CanvasViewException(loggerBreadcrumbs, "Unknown disposable material");
}

function materials(loggerBreadcrumbs: LoggerBreadcrumbs, materials: THREE.Material | THREE.Material[]): void {
  if (Array.isArray(materials)) {
    return void materials.forEach(child => {
      material(loggerBreadcrumbs.add("material"), child);
    });
  }

  return void material(loggerBreadcrumbs.add("material"), materials);
}

function texture(loggerBreadcrumbs: LoggerBreadcrumbs, texture: THREE.Texture): void {
  texture.dispose();
}

export default function dispose(loggerBreadcrumbs: LoggerBreadcrumbs, object: THREE.Object3D): void {
  object.traverse(function(child: THREE.Object3D) {
    // materials
    if (child instanceof THREE.Material) {
      return void materials(loggerBreadcrumbs.add("materials"), child);
    }

    // mesh
    // prettier-ignore
    if ( child instanceof THREE.LineSegments
      || child instanceof THREE.Mesh
      || child instanceof THREE.Points
    ) {
      child.geometry.dispose();

      return void materials(loggerBreadcrumbs.add("materials"), child.material);;
    }

    // not disposable objects
    // prettier-ignore
    if ( child instanceof THREE.Group
      || child instanceof THREE.Light
      || child.type === "Object3D"
    ) {
      return;
    }

    throw new CanvasViewException(loggerBreadcrumbs, "Unknown disposable object");
  });
}
