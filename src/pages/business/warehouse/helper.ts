import { BusWarehouseTypeEnum } from '@/apis/business/warehouse/typing';
import { BusMaterialTypeEnum } from '../techology-manage/Material/typing';

/**@name 将仓库存放类型转换为物料类型 */
export function formatWarehouseEnumToMaterialEnum(warehouseType?: BusWarehouseTypeEnum) {
  if (warehouseType === BusWarehouseTypeEnum.Material) {
    return BusMaterialTypeEnum.Material;
  } else if (warehouseType === BusWarehouseTypeEnum.Product) {
    return BusMaterialTypeEnum.Product;
  } else {
    return undefined;
  }
}
