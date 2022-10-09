import { BusOrderManufacture } from "@/apis/business/order-manage/manufacture/typing";

/**@name 获取表格款式名称 */
export function getTableStyleName(data: BusOrderManufacture) {
  return `${data.materialCode}${data.styleDemand.style ? `(${data.styleDemand.style})` : ''}`;
}
