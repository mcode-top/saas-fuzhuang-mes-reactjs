export type DraftsType = {
  name: string;
  id?: number;
  businessKey: string;
  data?: any;
  createdAt?: Date;
};
export type DraftsPageParamQuery = {
  name?: string;
  businessKey: string;
};
