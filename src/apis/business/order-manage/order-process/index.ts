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
