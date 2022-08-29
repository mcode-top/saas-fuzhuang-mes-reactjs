import { BusSizeTemplateItemType } from './../../../pages/business/techology-manage/SizeTemplate/typing';
import { BusMaterialType } from './../../../pages/business/techology-manage/Material/typing';

/**@name 仓库存放货品类型 */
export enum BusWarehouseTypeEnum {
  /**@name 成品 */
  Product = "0",
  /**@name 材料 */
  Material = "1",
  /**@name 混合 */
  Both = "2"
}
/**@name 出入库记录类型 */
export enum BusWarehouseLogTypeEnum {
  /**@name 出库 */
  Out = "0",
  /**@name 入库 */
  In = "1"
}
/**@name 仓库实体 */
export type BusWarehouseType = {
  id: number
  name: string;
  code: string;
  type: BusWarehouseTypeEnum;
  position?: string;
  maxCapacity?: number;
  remark?: string
}

/**@name 货架实体 */
export type BusWarehouseShelfType = {
  id: number
  warehouseId: number;
  warehouse?: BusWarehouseType
  name: string;
  code: string;
  position?: string;
  maxCapacity?: number;
  remark?: string
}

/**@name 货品实体 */
export type BusWarehouseGoodsType = {
  id: number
  /**@name 货架ID */
  shelfId: number;
  shelf?: BusWarehouseShelfType
  /**@name 物料编码 */
  materialCode: string;
  material?: BusMaterialType
  /**@name 尺码ID */
  sizeId?: number;
  size?: BusSizeTemplateItemType
  /**@name 库存数量 */
  quantity: number;
  remark?: string
}

/**@name 出入库记录实体 */
export type BusWarehouseLogType = {
  id: number
  goodsId: number;
  goods?: BusWarehouseGoodsType
  warehouseName: string;
  shelfName: string;
  changeNumber: number;
  type: BusWarehouseLogTypeEnum
  remark?: string
  contractNumber?: string
}
/**@name 货品分页参数 */
export type BusWarehouseGoodsPageParamQuery = {
  materialCode?: string
  remark?: string
  quantity?: number[]
}

/**@name 出入库参数 */
export type BusWarehousePutOutInGoodsDto = {
  shelfId: number
  materialCode: string
  /**@name 出入库数量必须大于0 */
  quantity: number
  sizeId?: number
  remark?: string
  contractNumber?: string
}
