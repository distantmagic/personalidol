import type { default as ServicesType } from "src/framework/types/Services";

type ServiceDependencies<Services extends ServicesType> = {
  [key in keyof Services]?: Services[key];
};

export default ServiceDependencies;
