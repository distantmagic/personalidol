import { default as ServiceBuilderInterface } from "src/framework/interfaces/ServiceBuilder";

import { default as ServiceDependenciesType } from "src/framework/types/ServiceDependencies";
import { default as ServicesType } from "src/framework/types/Services";

export default abstract class ServiceBuilder<Services extends ServicesType, ServiceKey extends keyof Services, ServiceDependencies extends ServiceDependenciesType<Services> = {}>
  implements ServiceBuilderInterface<Services, ServiceKey, ServiceDependencies> {
  abstract readonly key: ServiceKey;

  abstract build(dependencies: ServiceDependencies): Services[ServiceKey];

  readonly dependencies: ReadonlyArray<keyof ServiceDependencies> = [];
}
