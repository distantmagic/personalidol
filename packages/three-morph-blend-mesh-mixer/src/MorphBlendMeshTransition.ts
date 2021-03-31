import type { MorphBlendMesh } from "@personalidol/three-modules/src/misc/MorphBlendMesh.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { MorphBlendMeshTransition as IMorphBlendMeshTransition } from "./MorphBlendMeshTransition.interface";
import type { MorphBlendMeshTransitionState } from "./MorphBlendMeshTransitionState.type";

const TRANSITION_TIME: number = 0.1;

export function MorphBlendMeshTransition(
  mesh: MorphBlendMesh,
  fromAnimation: string,
  targetAnimation: string,
  initialBlendTime: number = TRANSITION_TIME
): IMorphBlendMeshTransition {
  const state: MorphBlendMeshTransitionState = Object.seal({
    needsUpdates: true,
    currentAnimation: fromAnimation,
    targetAnimation: targetAnimation,
  });

  const self: IMorphBlendMeshTransition = Object.freeze({
    state: state,

    transitionTo: transitionTo,
    update: update,
  });

  let _animationMix: number = 1;
  let _blendCounter: number = initialBlendTime;

  for (let animation of mesh.animationsList) {
    if (animation.name !== fromAnimation && animation.name !== targetAnimation) {
      mesh.setAnimationWeight(animation.name, 0);
    }
  }

  mesh.playAnimation(state.currentAnimation);
  mesh.playAnimation(state.targetAnimation);

  function _updateBlend(delta: number) {
    _animationMix = 1;

    if (_blendCounter > 0) {
      _animationMix = (TRANSITION_TIME - _blendCounter) / TRANSITION_TIME;
      _blendCounter -= delta;
    } else {
      state.currentAnimation = state.targetAnimation;
    }

    mesh.setAnimationWeight(state.targetAnimation, _animationMix);

    if (state.currentAnimation !== state.targetAnimation) {
      mesh.setAnimationWeight(state.currentAnimation, 1 - _animationMix);
    }
  }

  function transitionTo(animationName: string): IMorphBlendMeshTransition {
    if (animationName === state.targetAnimation) {
      return self;
    }

    if (_blendCounter > 0) {
      return MorphBlendMeshTransition(mesh, state.currentAnimation, animationName, TRANSITION_TIME - _blendCounter);
    }

    return MorphBlendMeshTransition(mesh, state.currentAnimation, animationName);
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    _updateBlend(delta);

    mesh.update(delta, elapsedTime, tickTimerState);
  }

  return self;
}
