import type { EntityLightAmbient } from "@personalidol/quakemaps/src/EntityLightAmbient.type";
import type { MountState } from "@personalidol/framework/src/MountState.type";
import type { View } from "@personalidol/framework/src/View.interface";

export function AmbientLightView(entity: EntityLightAmbient): View {
  const state: MountState = Object.seal({
    isDisposed: false,
    isMounted: false,
    isPreloaded: false,
    isPreloading: false,
  });

  function dispose(): void {}

  function mount(): void {}

  async function preload(): Promise<void> {}

  function unmount(): void {}

  function update(delta: number): void {}

  return Object.freeze({
    isScene: false,
    isView: true,
    name: `AmbientLight`,
    state: state,

    dispose: dispose,
    mount: mount,
    preload: preload,
    unmount: unmount,
    update: update,
  });
}
