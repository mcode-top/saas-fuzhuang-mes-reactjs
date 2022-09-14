import type { ActProcess } from '@/apis/process/typings';
import type { BusCustomerCompanyType } from '../../customer/typing';

/**
 * @name 款式类型
 * @description 现货，现货已经存在的款式 | 现货定制，表示系统有相似的款式但是可能需要变更一些工艺参数（面料、部位更改）| 全新定制，表示系统中没有相似的款式这是客户需要自主
 */
export enum BusOrderStyleTypeEnum {
  /**@name 现货 */
  SpotGoods = '0',
  /**@name 现货定制 */
  SpotGoodsCustom = '1',
  /**@name 全新定制 */
  Custom = '3',
}
/**@name 订单类型 */
export enum BusOrderTypeEnum {
  /**@name 样品单 */
  Sample = '0',
  /**@name 普通单 */
  Normal = '1',
}
/**@name 订单款式编号 */
export type BusOrderStyleDemand = {
  /**@name 物料编码(型号) */
  materialCode: string;
  /**@name 半新物料款式(需要现货定制) */
  oldMaterialCode: string;
  /**@name 款式类型 */
  styleType: BusOrderStyleTypeEnum;
  /**@name 产品名称(款式) */
  style?: string;
  /**@name 颜色 */
  color?: string;
  /**@name 尺码价格数量 */
  sizePriceNumber: BusOrderSizePriceNumber[];
  /**@name 面料 */
  shellFabric?: string;
  /**@name 领号 */
  领号?: string;
  /**@name 领子颜色 */
  领子颜色?: string;
  /**@name 领部缝纫工艺 */
  领部缝纫工艺?: string;
  /**@name 门襟工艺 */
  门襟工艺?: string;
  /**@name 袖口工艺 */
  袖口工艺?: string;
  /**@name 下摆工艺 */
  下摆工艺?: string;
  /**@name 纽扣工艺 */
  纽扣工艺?: string;
  /**@name 其他工艺 */
  其他工艺?: string;
  /**@name 商标 */
  商标?: string;
  /**@name 口袋 */
  口袋?: string;
  /**@name 后备扣 */
  后备扣?: string;
  /**@name 印刷单价 */
  印刷单价?: number;
  /**@name 绣花单价 */
  绣花单价?: number;
  /**@name 版费 */
  版费?: number;
  /**@name logo生产流程 */
  logo生产流程?: string;
  /**@name logo工艺位置 */
  logo工艺位置?: string;
  /**@name logo效果图 */
  logo效果图?: { name: string; position?: string }[];
  /**@name 总价 */
  totalPrice: number;
};
/**@name 尺码价格数量 */
export type BusOrderSizePriceNumber = {
  sizeId: number;
  number: number;
  price: number;
};

/**@name 合同单 */
export type BusOrderContract = {
  contractNumber: string;
  companyId: number;
  company?: BusCustomerCompanyType;
  addressId?: number;
  contactId?: number;
  deliverDate?: Date;
  packageDemand?: string;
  prepayPercent: number;
  invoiceType: string;
  salesCommissions?: number;
  logisticsMode: string;
  payment: string;
  type?: BusOrderTypeEnum;
  styleDemand: BusOrderStyleDemand[];
  remark?: string;
  processId: number;
  process?: ActProcess;
};
/**@name 审核合同单 */
export type ApproveContractDto = {
  contractNumber: string;
  /**@name 销售人员提成 */
  salesCommissions: number;
  result: boolean;
  opinion: string;
};
/**@name 合同单分页查询 */
export type ContractToProcessPageQuery = {
  deliverDate?: Date;
  contractNumber?: string;
  companyId?: number;
  invoiceType?: string;
  type?: BusOrderTypeEnum;
};
