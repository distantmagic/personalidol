import { default as ServiceDependenciesType } from "src/framework/types/ServiceDependencies";
import { default as ServicesType } from "src/framework/types/Services";

export default interface ServiceBuilder<Services extends ServicesType, ServiceKey extends keyof Services, ServiceDependencies extends ServiceDependenciesType<Services>> {
  readonly key: ServiceKey;
  readonly dependencies: ReadonlyArray<keyof ServiceDependencies>;

  build(dependencies: ServiceDependencies): Services[ServiceKey];
}
