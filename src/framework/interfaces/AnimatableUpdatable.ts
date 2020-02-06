import SchedulerUpdateScenario from "src/framework/enums/SchedulerUpdateScenario";

export default interface AnimatableUpdatable {
  update(delta: number): void;

  useUpdate(): SchedulerUpdateScenario;
}
