import { BusStationType } from '../Station/typing';

/**@name  物料类型*/
export enum BusMaterialTypeEnum {
  /**@name 材料 */
  Material = '0',
  /**@name 成衣 */
  Product = '1',
}

/**@name 物料编码类型 */
export type BusMaterialType = {
  code: string;
  name: string;
  type: BusMaterialTypeEnum;
  unit: string;
  price?: number;
  codes?: string[];
  remark?: string;
};
