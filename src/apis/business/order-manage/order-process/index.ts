import { request } from 'umi';
import type { ContractProcessAddDto, OrderContractProcessType } from './typing';

/**@name 合同订单流程记录分页 */
export function fetchOrderContractProcessList(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<OrderContractProcessType>>>(
    '/order-process/page',
    {
      method: 'POST',
      data,
    },
  );
}

/**@name 添加合同订单流程记录 */
export function fetchOrderContractProcessAdd(data: ContractProcessAddDto) {
  return request<RESULT_SUCCESS>('/order-process/add', {
    method: 'POST',
    data,
  });
}
/**@name 查看合同流程记录 */
export function fetchWatchContractProcessLogList(contractNumber: string) {
  return request<RESULT_SUCCESS>('/order-process/watch/' + contractNumber, {
    method: 'GET',
  });
}
/**@name 获取未完成的合同流程(前20个) */
export function fetchUndoneContractList(partContractNumber: string) {
  return request<RESULT_SUCCESS>('/order-process/undone-contract-list', {
    method: 'GET',
    params: { partContractNumber },
  });
}
/**
 * 业务订单撤回流程
 */
export function fetchOrderRecall(contractNumber: string, processId: number) {
  return request<RESULT_SUCCESS>('/order-process/recall/' + contractNumber + '/' + processId, {
    method: 'POST',
  });
}
