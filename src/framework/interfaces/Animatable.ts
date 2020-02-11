import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";

export default interface Animatable extends AnimatableUpdatable {
  draw(): void;

  useDraw(): SchedulerUpdateScenario;
}
