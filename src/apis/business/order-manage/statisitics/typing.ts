import type { UserInfo } from '@/apis/user/typings';

/**@name 销售统计类型 */
export type SalesStatisiticsType = {
  /**@name 销售员名称 */
  salesmanName: string;
  /**@name 销售员Id */
  salesmanId: number;
  /**@name 总销售额 */
  salesVolume: number;
  /**@name 总提成 */
  salesCommission: number;
  /**@name 销售数量 */
  salesTotal: number;
};
/**@name 统计销售已完成的合同单数据 */
export type SalesStatisiticsContractType = {
  contractNumber: string;
  salesProportion: number;
  completeDate: string;
  /**@name 收款是否已完成 */
  isCollectionDone: boolean;
} & SalesStatisiticsType;

/**@name 统计计件单工资 */
export type StatisiticsRecordPieceType = {
  /**@name 领料总数 */
  countMaterialNumber: number;
  /**@name 计件总数 */
  countRecordNumber: number;
  /**@name 总工资 */
  countWages: number;
  worker: UserInfo;
};
