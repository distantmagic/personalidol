import isEmpty from "lodash/isEmpty";

import ServiceBuilder from "src/framework/interfaces/ServiceBuilder";
import { default as ServiceContainerInterface } from "src/framework/interfaces/ServiceContainer";

import { default as ServiceDependenciesType } from "src/framework/types/ServiceDependencies";
import { default as ServicesType } from "src/framework/types/Services";

type RegisteredServices<Services extends ServicesType> = {
  [key in keyof Services]?: ServiceBuilder<Services, key, ServiceDependenciesType<Services>>;
};

export default class ServiceContainer<Services extends ServicesType> implements ServiceContainerInterface<Services> {
  private readonly registeredServices: RegisteredServices<Services> = {} as RegisteredServices<Services>;

  register<ServiceKey extends keyof Services>(serviceBuilder: ServiceBuilder<Services, ServiceKey, ServiceDependenciesType<Services>>): void {
    if (this.registeredServices.hasOwnProperty(serviceBuilder.key)) {
      throw new Error(`Service is already registered: "${serviceBuilder.key}"`);
    }

    this.registeredServices[serviceBuilder.key] = serviceBuilder;
  }

  reuse<ServiceKey extends keyof Services>(serviceKey: ServiceKey, prebuildServices: ServiceDependenciesType<Services> = {}): Services[ServiceKey] {
    const serviceBuilder = this.registeredServices[serviceKey];

    if (!serviceBuilder) {
      throw new Error(`Service is not registered: "${serviceKey}"`);
    }

    if (isEmpty(serviceBuilder.dependencies)) {
      return serviceBuilder.build({});
    }

    const dependencies: ServiceDependenciesType<Services> = {};

    for (let dependency of serviceBuilder.dependencies) {
      if (!prebuildServices.hasOwnProperty(dependency)) {
        prebuildServices[dependency] = this.reuse(dependency, prebuildServices);
      }

      dependencies[dependency] = prebuildServices[dependency];
    }

    return serviceBuilder.build(dependencies);
  }
}
