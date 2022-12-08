import type { UserListItem } from '@/apis/person/typings';
import type { BusSizeTemplateItemType } from './../../../pages/business/techology-manage/SizeTemplate/typing';
import type { BusMaterialType } from './../../../pages/business/techology-manage/Material/typing';

/**@name 仓库存放货品类型 */
export enum BusWarehouseTypeEnum {
  /**@name 成品 */
  Product = '0',
  /**@name 材料 */
  Material = '1',
  /**@name 混合 */
  Both = '2',
}
/**@name 出入库记录类型 */
export enum BusWarehouseLogTypeEnum {
  /**@name 出库 */
  Out = '0',
  /**@name 入库 */
  In = '1',
}
/**@name 仓库实体 */
export type BusWarehouseType = {
  id: number;
  name: string;
  code: string;
  type: BusWarehouseTypeEnum;
  position?: string;
  maxCapacity?: number;
  remark?: string;
};

/**@name 货架实体 */
export type BusWarehouseShelfType = {
  id: number;
  warehouseId: number;
  warehouse?: BusWarehouseType;
  name: string;
  code: string;
  position?: string;
  maxCapacity?: number;
  remark?: string;
};

/**@name 货品实体 */
export type BusWarehouseGoodsType = {
  id: number;
  /**@name 货架ID */
  shelfId: number;
  shelf?: BusWarehouseShelfType;
  /**@name 物料编码 */
  materialCode: string;
  material?: BusMaterialType;
  /**@name 尺码ID */
  sizeId?: number;
  size?: BusSizeTemplateItemType;
  /**@name 库存数量 */
  quantity: number;
  remark?: string;
  operator?: UserListItem;
  operatorId: number;
  /**@name 颜色 */
  color?: string;
};

/**@name 出入库记录实体 */
export type BusWarehouseLogType = {
  id: number;
  goodsId: number;
  goods?: BusWarehouseGoodsType;
  warehouseName: string;
  shelfName: string;
  changeNumber: number;
  type: BusWarehouseLogTypeEnum;
  remark?: string;
  contractNumber?: string;
};
/**@name 货品分页参数 */
export type BusWarehouseGoodsPageParamQuery = {
  materialCode?: string;
  remark?: string;
  quantity?: number[];
  createdAt?: Date[];
  updatedAt?: Date[];
};
/**@name 货品出入库分页参数 */
export type BusWarehouseGoodsOutInLogPageParamQuery = {
  remark?: string;
  changeNumber?: number[];
  createdAt?: Date[];
  operatorId?: number;
  type?: BusWarehouseLogTypeEnum;
};

/**@name 入库参数 */
export type BusWarehousePutInGoodsDto = {
  shelfId: number;
  materialCode: string;
  /**@name 出入库数量必须大于0 */
  quantity: number;
  sizeId?: number;
  color?: string;
  remark?: string;
  /**@name 绑定合同单号 */
  contractNumber?: string;
};
/**@name 出库参数 */
export type BusWarehousePutOutGoodsDto = {
  goodsId: number;
  deliveryCount: number;
  /**@name 绑定合同单号 */
  contractNumber?: string;
  remark?: string;
};

/**@name Excel批量入库 */
export type ExcelManyPutInGoodsDto = {
  /**@name 绑定的合同单 */
  contractNumber?: string;
  shelfId: number;
  data: ExcelManyPutInGoodsDataDto[];
};
/**@name Excel批量入库数据 */
export type ExcelManyPutInGoodsDataDto = {
  materialCode: string;
  sizeId?: number;
  deliveryCount: number;
  remark?: string;
  color?: string;
  sizeName?: string;
};

/**@name 批量出入库 */
export type ManyPutOutInDto = {
  data: {
    goodsId: number;
    operationNumber: number;
  }[];
  type: BusWarehouseLogTypeEnum;
  remark?: string;
  /**@name 绑定的合同单 */
  contractNumber?: string;
};

/**@name 当前物料编码总库存数量类型 */
export type BusWarehouseGoodQuantityType = {
  materialCode: string;
  material: BusMaterialType;
  sizeId?: number;
  size?: BusSizeTemplateItemType;
  color?: string;
  total?: number;
  goods?: BusWarehouseGoodsType[];
};

/**@name 成衣货品批量入库 */
export type ProducuGoodsManyPutInDto = {
  data: ProduceGoodsManyPutInDataDto[];
  remark?: string;
  /**@name 绑定的合同单 */
  contractNumber?: string;
};
/**@name 其他货品批量出入库数据 */
export type ProduceGoodsManyPutInDataDto = {
  sizeId: number;
  color: string;
  materialCode: string;
  operationNumber: number;
  shelfId: number;
};
