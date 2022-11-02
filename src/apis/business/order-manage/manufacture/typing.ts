import type { ActProcess } from '@/apis/process/typings';
import type { BusOrderContract, BusOrderStyleDemand } from '../contract/typing';
import type { BusOrderRecordPiece } from '../record-piece/typing';
/**@name 生产工价表 */
export type BusManufactureWorkPriceTable = {
  /**@name 工价id */
  workPriceId: number;
  workProcessWrokPrice: BusWorkProcessPrice[];
};

/**@name 工序工价 */
export type BusWorkProcessPrice = {
  /**@name 工序 */
  workProcessId: number;
  /**@name 原工价单价格 */
  price: number;
  /**@name 变更价格 */
  changePrice: number;
};

/**@name 生产单 */
export type BusOrderManufacture = {
  id: number;
  contractNumber: string;
  materialCode: string;
  contract?: BusOrderContract;
  styleDemand: BusOrderStyleDemand;
  workPriceTable: BusManufactureWorkPriceTable[];
  remark?: string;
  processId: number;
  process?: ActProcess;
  deliverDate?: Date | string;
  recordPiece?: BusOrderRecordPiece;
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
  workPriceTable: BusManufactureWorkPriceTable[];
  deliverDate?: Date;
  remark?: string;
  /**@name 是否修改过工价单 */
  isUpdateWorkPrice: boolean;
  opinion: string;
};
/**@name 生产单货品入库 */
export type ManufactureGoodsPutInStockDto = {
  contractNumber: string;
  contractGoodsList: ManufactureContractGoodsPutIn[];
};
/**@name 货品入库列表 */
export type ManufactureContractGoodsPutIn = {
  contractGoodsId: number;
  quantity: number;
  shlefId: number;
};
