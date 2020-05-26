import type SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import type AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";

export default interface Animatable extends AnimatableUpdatable {
  draw(delta: number): void;

  useDraw(): SchedulerUpdateScenario;
}
