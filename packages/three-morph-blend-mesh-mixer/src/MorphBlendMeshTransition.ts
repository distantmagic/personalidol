import type { MorphBlendMesh } from "@personalidol/three-modules/src/misc/MorphBlendMesh.interface";
import type { TickTimerState } from "@personalidol/framework/src/TickTimerState.type";

import type { MorphBlendMeshTransition as IMorphBlendMeshTransition } from "./MorphBlendMeshTransition.interface";
import type { MorphBlendMeshTransitionState } from "./MorphBlendMeshTransitionState.type";

const TRANSITION_FRAMES: number = 15;

export function MorphBlendMeshTransition(mesh: MorphBlendMesh, fromAnimation: string, targetAnimation: string): IMorphBlendMeshTransition {
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
  let _blendCounter: number = TRANSITION_FRAMES;

  for (let animation of mesh.animationsList) {
    if (animation.name !== fromAnimation && animation.name !== targetAnimation) {
      mesh.setAnimationWeight(animation.name, 0);
    }
  }

  mesh.setAnimationWeight(state.currentAnimation, 1);
  mesh.playAnimation(state.currentAnimation);

  mesh.setAnimationWeight(state.targetAnimation, 0);
  mesh.playAnimation(state.targetAnimation);

  function _updateBlend() {
    _animationMix = 1;

    if (_blendCounter > 0) {
      _animationMix = (TRANSITION_FRAMES - _blendCounter) / TRANSITION_FRAMES;
      _blendCounter -= 1;
    } else {
      if (state.currentAnimation !== state.targetAnimation) {
        mesh.setAnimationWeight(state.currentAnimation, 0);
      }
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

    return MorphBlendMeshTransition(mesh, state.targetAnimation, animationName);
  }

  function update(delta: number, elapsedTime: number, tickTimerState: TickTimerState): void {
    _updateBlend();

    mesh.update(delta, elapsedTime, tickTimerState);
  }

  return self;
}
