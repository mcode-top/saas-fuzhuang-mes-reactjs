/**@name 客户类型 */
export enum BusCustomerTypeEnum {
  /**@name 普通客户 */
  Normal = '0',
  /**@name VIP客户 */
  VIP = '1',
}

/**@name 客户公司 */
export type BusCustomerCompanyType = {
  id: number;
  name: string;
  type: BusCustomerTypeEnum;
  address?: string;
  phone?: string;
  remark?: string;
};

/**@name 客户联系人 */
export type BusCustomerContacterType = {
  id: number;
  name: string;
  companyId: number;
  phone: string;
  dept?: string;
  role?: string;
  remark?: string;
};

/**@name 客户地址 */
export type BusCustomerAddressType = {
  id: number;
  name: string;
  companyId: number;
  address: string;
  phone: string;
  remark?: string;
};
