import { default as ServiceKeyType } from "src/framework/types/ServiceKey";

type ServiceBuilder<Services extends {}, ServiceKey extends ServiceKeyType<Services>, DependneciesKeys extends ServiceKeyType<Services>> = (
  dependencies: Omit<Pick<Services, DependneciesKeys>, ServiceKey>
) => Services[ServiceKey];

export default ServiceBuilder;
