import type { ActProcess } from '@/apis/process/typings';
import type { BusOrderContract, BusOrderStyleDemand } from '../contract/typing';
/**@name 工序工价 */
export type BusManufactureWorkProcessAndWorkPrice = {
  /**@name 关联工序Id */
  workProcessId?: number;
  /**@name 工序名称 */
  name: string;
  /**@name 工价 */
  price: number;
  /**@name 工价id */
  workPriceId: number;
};

/**@name 生产单 */
export type BusOrderManufacture = {
  id: number;
  contractNumber: string;
  materialCode: string;
  contract?: BusOrderContract;
  styleDemand: BusOrderStyleDemand;
  workProcessWrokPrice: BusManufactureWorkProcessAndWorkPrice;
  remark?: string;
  processId: number;
  process?: ActProcess;
  deliverDate?: Date;
};
/**@name 审核合同单 */
export type ApproveContractDto = {
  contractNumber: string;
  /**@name 销售人员提成 */
  salesCommissions: number;
  result: boolean;
  opinion: string;
};
/**@name 修改生产单 */
export type UpdateManufactureDto = {
  workProcessWrokPrice: BusManufactureWorkProcessAndWorkPrice[];
  deliverDate?: Date;
  remark?: string;
  /**@name 是否修改过工价单 */
  isUpdateWorkPrice: boolean;
  opinion: string;
};
