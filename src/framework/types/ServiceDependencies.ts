import { default as ServiceKeyType } from "src/framework/types/ServiceKey";

type ServiceDependencies<Services extends {}, ServiceKey extends ServiceKeyType<Services>, DependneciesKeys extends ServiceKeyType<Services>> = ReadonlyArray<
  Exclude<DependneciesKeys, ServiceKey>
>;

export default ServiceDependencies;
