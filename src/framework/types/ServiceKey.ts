type ServiceKey<Services extends {}> = keyof Services & string;

export default ServiceKey;
