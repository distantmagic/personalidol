import ServiceBuilder from "src/framework/types/ServiceBuilder";
import ServiceDependencies from "src/framework/types/ServiceDependencies";
import { default as ServiceKeyType } from "src/framework/types/ServiceKey";
import { default as ServicesType } from "src/framework/types/Services";

export default interface ServiceContainer<Services extends ServicesType> {
  getServiceDependencies<ServiceKey extends ServiceKeyType<Services>>(key: ServiceKey): ReadonlyArray<ServiceKeyType<Services>>;

  register<ServiceKey extends ServiceKeyType<Services>, DependneciesKeys extends ServiceKeyType<Services>>(
    key: ServiceKey,
    dependencies: ServiceDependencies<Services, ServiceKey, DependneciesKeys>,
    builder: ServiceBuilder<Services, ServiceKey, DependneciesKeys>
  ): void;

  reuse<ServiceKey extends ServiceKeyType<Services>>(key: ServiceKey): Services[ServiceKey];
}
