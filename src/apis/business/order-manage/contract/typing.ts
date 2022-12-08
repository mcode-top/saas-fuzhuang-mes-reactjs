import type { BusSizeTemplateItemType } from './../../../../pages/business/techology-manage/SizeTemplate/typing';
import type { BusMaterialType } from './../../../../pages/business/techology-manage/Material/typing';
import type { BusCustomerAddressType, BusCustomerContacterType } from './../../customer/typing';
import type { ActProcess, ApproveTaskDto } from '@/apis/process/typings';
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
  /**@name 普通单 */
  Normal = '0',
  /**@name 样品单-打样 */
  SampleProofing = '1',
  /**@name 样品单-收费寄样 */
  SampleCharge = '2',
  /**@name 样品单-免费寄样 */
  SampleSend = '3',
  /**@name 加单 */
  Add = '4',
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
  /**@name 颜色组 */
  colorGroup?: string[];
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
  其他费用?: number;
  logo?: {
    /**@name logo生产流程 */
    logo生产流程?: string;
    /**@name logo工艺位置 */
    logo工艺位置?: string;
    /**@name logo效果图 */
    logo效果图?: { name: string; position?: string }[];
  }[];
  /**@name 总价 */
  totalPrice: number;
};
/**@name 尺码价格数量 */
export type BusOrderSizePriceNumber = {
  sizeId: number;
  color: string;
  number: number;
  price: number;
};

/**@name 合同单 */
export type BusOrderContract = {
  contractNumber: string;
  companyId: number;
  company?: BusCustomerCompanyType;
  address?: BusCustomerAddressType;
  addressId?: number;
  contact?: BusCustomerContacterType;
  contactId?: number;
  deliverDate?: string;
  packageDemand?: string;
  prepayPercent: number;
  invoiceType: string;
  salesCommissions?: number;
  logisticsMode: string;
  payment: string;
  type: BusOrderTypeEnum;
  styleDemand: BusOrderStyleDemand[];
  remark?: string;
  processId: number;
  process?: ActProcess;
  /**@name 有无样衣 */
  sampleRemark?: string;
  /**@name 配货单是否打印 */
  distributionPrint?: boolean;
};
/**@name 创建合同单-加单参数 */
export type BusOrderContractOrderAddDto = BusOrderContract & {
  contractNumber: string;
  suffixContractNumber: string;
};
/**@name 审核合同单 */
export type ApproveContractDto = ApproveTaskDto & {
  contractNumber: string;
  /**@name 销售人员提成 */
  salesCommissions: number;
};
/**@name 合同单分页查询 */
export type ContractToProcessPageQuery = {
  deliverDate?: Date;
  contractNumber?: string;
  companyId?: number;
  invoiceType?: string;
  type?: BusOrderTypeEnum;
};
/**@name 合同货品库表 */
export type BusOrderContractGoodsEntity = {
  id: number;
  contractNumber: string;
  contract?: BusOrderContract;
  materialCode: string;
  material?: BusMaterialType;
  sizeId: number;
  size?: BusSizeTemplateItemType;
  needQuantity: number;
  beenInQuantity: number;
  beenOutQuantity: number;
  color: string;
};
/**@name 创建寄样单 */
export type CreateSampleSendDto = {
  /**@name 寄样单分免费与收费两种 */
  type: BusOrderTypeEnum.SampleCharge | BusOrderTypeEnum.SampleSend;
  // ------- 客户信息
  companyId: number;
  contactId?: number;
  addressId: number;
  /**@name 物流方式 */
  logisticsMode?: string;
  /**@name 包装要求 */
  packageDemand?: string;
  /**@name 付款方式 -付费寄养 */
  payment?: string;
  /**@name 预付比例 -付费寄养 */
  prepayPercent?: number;
  orderSampleStyleDemand: OrderSampleStyleDemand[];
};
/**@name 修改寄样单 */
export type UpdateSampleSendDto = {
  // ------- 客户信息
  companyId: number;
  contactId?: number;
  addressId: number;
  /**@name 物流方式 */
  logisticsMode?: string;
  /**@name 包装要求 */
  packageDemand?: string;
  /**@name 付款方式 -付费寄养 */
  payment?: string;
  /**@name 预付比例 -付费寄养 */
  prepayPercent?: number;
  orderSampleStyleDemand: OrderSampleStyleDemand[];
};
/**@name 寄样单款式需求 */
export type OrderSampleStyleDemand = {
  /**@name 物料编码 */
  materialCode: string;
  /**@name 总价 & 如果是送样则无 */
  totalPrice?: number;
  /**@name 尺码价格数量 & 如果是送样则不需要填写价格或为0 */
  sizePriceNumber: BusOrderSizePriceNumber[];
};

/**@name 审核寄样单 */
export type ApprvoeSampleSendDto = ApproveTaskDto & {
  /**@name 销售提成 -付费寄养 */
  salesCommissions?: number;
  contractNumber: string;
};
