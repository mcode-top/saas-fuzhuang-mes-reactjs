import { request } from 'umi';
import type { BusAddCollectionShil, BusOrderContractCollectionSlip } from './typing';

/**@name 合同收款单分页 */
export function fetchOrderCollectionSlipList(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusOrderContractCollectionSlip>>>(
    '/collection-slip/page',
    {
      method: 'POST',
      data,
    },
  );
}

/**@name 添加收款记录 */
export function fetchOrderAddCollectionSlip(data: BusAddCollectionShil) {
  return request<RESULT_SUCCESS>('/collection-slip/add', {
    method: 'POST',
    data,
  });
}
/**@name 通过合同号获取收款记录及信息 */
export function fetchCollectionSlipInfo(contractNumber: string) {
  return request<RESULT_SUCCESS<BusOrderContractCollectionSlip>>(
    '/collection-slip/log/' + contractNumber,
    {
      method: 'GET',
    },
  );
}
