import type { BusOrderContract } from '../contract/typing';

/**@name 创建合同订单流程记录 */
export type ContractProcessAddDto = {
  contractNumber: string;
  message?: string;
  status?: ContractProcessEnum;
};
/**@name 流程过程记录 */
export type ContractProcessLog = {
  status: ContractProcessEnum;
  message: string;
  createdAt: string;
  id: number;
};
/**@name 流程状态 */
export enum ContractProcessEnum {
  /**@name 运行中 */
  Running = '0',
  /**@name 已停止 */
  Stop = '1',
  /**@name 已完成 */
  Done = '2',
}
/**@name 合同订单流程记录 */
export type OrderContractProcessType = {
  contractNumber: string;
  contract?: BusOrderContract;
  message: string;
  status: ContractProcessEnum;
  processLog: ContractProcessLog[];
};
