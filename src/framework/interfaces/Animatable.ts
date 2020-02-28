import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";

export default interface Animatable extends AnimatableUpdatable {
  draw(delta: number): void;

  useDraw(): SchedulerUpdateScenario;
}
