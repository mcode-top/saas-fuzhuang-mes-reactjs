import type {
  BusManufactureNeedProductionTable,
  BusOrderSizePriceNumberProductionQuantity,
} from './../../../../apis/business/order-manage/manufacture/typing';
import type { BusOrderSizePriceNumber } from './../../../../apis/business/order-manage/contract/typing';
import type { BusOrderManufacture } from '@/apis/business/order-manage/manufacture/typing';

/**@name 获取表格款式名称 */
export function getTableStyleName(data: BusOrderManufacture) {
  return `${data.materialCode}${data.styleDemand.style ? `(${data.styleDemand.style})` : ''}`;
}
/**@name 合并需要生产数量与尺码价格表 */
export function mergeNeedProducetionAndSizePriceNumber(
  sizePriceNumber: BusOrderSizePriceNumber[],
  needProduction: BusManufactureNeedProductionTable[],
): BusOrderSizePriceNumberProductionQuantity[] {
  return sizePriceNumber.map((item) => {
    const find = needProduction?.find((i) => {
      return i.color === item.color && i.sizeId === item.sizeId;
    });
    return {
      ...item,
      productionQuantity: find?.needQuantity || 0,
    };
  });
}
