import type { BusWarehouseGoodsType } from './../../warehouse/typing';
import type { BusOrderContract } from './../contract/typing';
import type { UserListItem } from '@/apis/person/typings';
import type { ActProcess, ApproveTaskDto } from '@/apis/process/typings';

/**@name 发货单的品类和数量实体 */
export type BusOrderDeliveryGoodsAndNumberDto = {
  goodsId: number;
  quantity: number;
};
/**@name 创建发货单 */
export type BusOrderCreateDeliveryDto = {
  contractNumber: string;
  logisticsCompany: string;
  expressNumber: string;
  address: string;
  contact: string;
  phone: string;
  /**@name 发货单的品类和数量实体 */
  goodsAndNumber: BusOrderDeliveryGoodsAndNumberDto[];
  remark: string;
  id?: number;
};
/**@name 修改发货单 */
export type BusOrderUpdateDeliveryDto = {
  contractNumber: string;
  logisticsCompany: string;
  expressNumber: string;
  address: string;
  contact: string;
  phone: string;
  /**@name 发货单的品类和数量实体 */
  goodsAndNumber: BusOrderDeliveryGoodsAndNumberDto[];
  remark: string;
};
/**@name 审核发货单 */
export type BusOrderDeliveryApproveTaskDto = ApproveTaskDto & {
  deliveryId: number;
};
/**@name 发货单 */
export type BusOrderDeliveryEntity = {
  id: number;
  contractNumber: string;
  contract?: BusOrderContract;
  logisticsCompany: string;
  expressNumber: string;
  address: string;
  contact: string;
  phone: string;
  goodsAndNumber?: BusOrderDeliveryGoodsAndNumberEntity[];
  processId: number;
  isEdit: boolean;
  process?: ActProcess;
  remark: string;
};

/**@name 发货单的品类和数量 */
export type BusOrderDeliveryGoodsAndNumberEntity = {
  id: number;
  goodsId: number;
  goods?: BusWarehouseGoodsType;
  quantity: number;
  deliveryId: number;
  delivery?: BusOrderDeliveryEntity;
  operator?: UserListItem;
  operatorId: number;
};
