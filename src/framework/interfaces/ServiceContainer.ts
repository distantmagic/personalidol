import ServiceBuilder from "src/framework/interfaces/ServiceBuilder";

import { default as ServiceDependenciesType } from "src/framework/types/ServiceDependencies";
import { default as ServicesType } from "src/framework/types/Services";

export default interface ServiceContainer<Services extends ServicesType> {
  register<ServiceKey extends keyof Services>(serviceBuilder: ServiceBuilder<Services, ServiceKey, ServiceDependenciesType<Services>>): void;

  reuse<ServiceKey extends keyof Services>(serviceKey: ServiceKey): Services[ServiceKey];
}
