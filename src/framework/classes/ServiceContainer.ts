import isEmpty from "lodash/isEmpty";
import pick from "lodash/pick";
import toposort from "toposort";

import { default as ServiceContainerInterface } from "src/framework/interfaces/ServiceContainer";

import ServiceBuilder from "src/framework/types/ServiceBuilder";
import ServiceDependencies from "src/framework/types/ServiceDependencies";
import { default as ServiceKeyType } from "src/framework/types/ServiceKey";
import { default as ServicesType } from "src/framework/types/Services";

export default class ServiceContainer<Services extends ServicesType> implements ServiceContainerInterface<Services> {
  private readonly builders: Map<ServiceKeyType<Services>, ServiceBuilder<Services, ServiceKeyType<Services>, ServiceKeyType<Services>>> = new Map();
  private readonly edges: Array<[ServiceKeyType<Services>, ServiceKeyType<Services>]> = [];
  private needsSorting: boolean = false;
  private sorted: Array<ServiceKeyType<Services>> = [];

  getServiceDependencies<ServiceKey extends ServiceKeyType<Services>>(key: ServiceKey): ReadonlyArray<ServiceKeyType<Services>> {
    const neededDependencies: Array<ServiceKeyType<Services>> = [];

    for (let [edgeStart, edgeEnd] of this.edges) {
      if (key === edgeEnd) {
        neededDependencies.push(edgeStart);
      }
    }

    if (isEmpty(neededDependencies)) {
      return neededDependencies;
    }

    return this.getSortedDependencies().filter(function(sorted) {
      return neededDependencies.includes(sorted);
    });
  }

  register<ServiceKey extends ServiceKeyType<Services>, DependneciesKeys extends ServiceKeyType<Services>>(
    key: ServiceKey,
    dependencies: ServiceDependencies<Services, ServiceKey, DependneciesKeys>,
    builder: ServiceBuilder<Services, ServiceKey, DependneciesKeys>
  ): void {
    if (dependencies.length > 0) {
      this.needsSorting = true;
    }

    for (let dependency of dependencies) {
      this.edges.push([dependency, key]);
    }

    this.builders.set(key, builder);
  }

  reuse<ServiceKey extends ServiceKeyType<Services>>(key: ServiceKey, services: ServicesType = {}): Services[ServiceKey] {
    const dependencies = this.getServiceDependencies(key);

    for (let serviceKey of dependencies) {
      if (!services.hasOwnProperty(serviceKey)) {
        services[serviceKey] = this.reuse(serviceKey, services);
      }
    }

    return this.getServiceBuilder(key)(pick(services, dependencies));
  }

  private getServiceBuilder<ServiceKey extends ServiceKeyType<Services>>(key: ServiceKey): ServiceBuilder<Services, ServiceKey, ServiceKeyType<Services>> {
    const builder = this.builders.get(key);

    if (!builder) {
      throw new Error(`Service for builder is not defined but it was expected: "${key}"`);
    }

    return builder;
  }

  private getSortedDependencies(): ReadonlyArray<ServiceKeyType<Services>> {
    if (this.needsSorting) {
      this.sorted = toposort(this.edges);
      this.needsSorting = false;
    }

    return this.sorted;
  }
}
