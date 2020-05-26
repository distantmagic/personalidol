import type { default as ServiceBuilderParametersType } from "src/framework/types/ServiceBuilderParameters";
import type { default as ServiceDependenciesType } from "src/framework/types/ServiceDependencies";
import type { default as ServicesType } from "src/framework/types/Services";

export default interface ServiceBuilder<
  Services extends ServicesType,
  ServiceKey extends keyof Services,
  ServiceDependencies extends ServiceDependenciesType<Services>,
  ServiceBuilderParameters extends ServiceBuilderParametersType
> {
  readonly key: ServiceKey;
  readonly dependencies: ReadonlyArray<keyof ServiceDependencies>;

  build(dependencies: ServiceDependencies, parameters: ServiceBuilderParameters): Services[ServiceKey];
}
