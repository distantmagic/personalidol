import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

import AnimatableUpdatable from "src/framework/interfaces/AnimatableUpdatable";

export default interface Animatable extends AnimatableUpdatable {
  begin(): void;

  draw(interpolationPercentage: number): void;

  end(fps: number, isPanicked: boolean): void;

  useBegin(): SchedulerUpdateScenario;

  useDraw(): SchedulerUpdateScenario;

  useEnd(): SchedulerUpdateScenario;
}
