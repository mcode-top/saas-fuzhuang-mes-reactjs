import type { UserListItem } from '@/apis/person/typings';
import type { BusOrderContract } from '../contract/typing';

/**@name 合同收款单 */
export type BusOrderContractCollectionSlip = {
  contractNumber: string;
  contract?: BusOrderContract;
  totalAmount: number;
  collectionAmount: number;
  status: BusCollectionShilStatusEnmu;
  collectionLog?: BusOrderContractCollectionSlipLog[];
};
/**@name 合同收款单记录 */
export type BusOrderContractCollectionSlipLog = {
  contractNumber: string;
  paymentAmount: number;
  paymentDate: Date;
  paymentMethod: string;
  collectionSlip?: BusOrderContractCollectionSlip;
  operator?: UserListItem;
  operatorId: number;
};
/**@name 添加收款记录 */
export type BusAddCollectionShil = {
  contractNumber: string;
  paymentList: BusPaymentAMountCollectionSlipForm[];
};
/**@name 付款表单 */
export type BusPaymentAMountCollectionSlipForm = {
  paymentAmount: number;
  /**@name 付款方式 */
  paymentMethod: string;
  /**@name 付款方式 */
  paymentDate: Date;
};
/**@name 收款单收款状态 */
export enum BusCollectionShilStatusEnmu {
  /**@name 已完成 */
  Collection = '0',
  /**@name 未完成 */
  UnCollection = '1',
}
