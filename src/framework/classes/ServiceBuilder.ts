import { default as ServiceBuilderInterface } from "src/framework/interfaces/ServiceBuilder";

import { default as ServiceBuilderParametersType } from "src/framework/types/ServiceBuilderParameters";
import { default as ServiceDependenciesType } from "src/framework/types/ServiceDependencies";
import { default as ServicesType } from "src/framework/types/Services";

export default abstract class ServiceBuilder<
  Services extends ServicesType,
  ServiceKey extends keyof Services,
  ServiceDependencies extends ServiceDependenciesType<Services> = {},
  ServiceBuilderParameters extends ServiceBuilderParametersType = {}
> implements ServiceBuilderInterface<Services, ServiceKey, ServiceDependencies, ServiceBuilderParameters> {
  abstract readonly key: ServiceKey;

  abstract build(dependencies: ServiceDependencies, parameters: ServiceBuilderParameters): Services[ServiceKey];

  readonly dependencies: ReadonlyArray<keyof ServiceDependencies> = [];
}
