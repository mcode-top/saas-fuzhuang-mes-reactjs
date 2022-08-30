import type { BusWorkPriceType } from '@/pages/business/techology-manage/WorkPrice/typing';
import { request } from 'umi';
import type { WorkPricePageParamQuery } from './typing';

/**@name 创建工价 */
export function fetchCreateWorkPrice(data: BusWorkPriceType) {
  return request<RESULT_SUCCESS<any>>('/work-price', {
    method: 'POST',
    data,
  });
}
/**@name 更新工价 */
export function fetchUpdateWorkPrice(data: BusWorkPriceType & { id: number }) {
  return request<RESULT_SUCCESS<any>>('/work-price', {
    method: 'PATCH',
    data,
  });
}

/**@name 工价分页 */
export function fetchWorkPriceList(data: PAGINATION_QUERY.Param<WorkPricePageParamQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusWorkPriceType>>>('/work-price/page', {
    method: 'POST',
    data,
  });
}
/**@name 批量删除工价 */
export function fetchManyRemoveWorkPrice(ids: number[]) {
  return request<RESULT_SUCCESS<any>>('/work-price/many-remove', {
    method: 'POST',
    data: { ids },
  });
}
/**@name 获取全部工价列表(仅name与id) */
export function fetchNameListWorkPrice() {
  return request<RESULT_SUCCESS<{ name: string; id: number }[]>>('/work-price/all/name-to-id', {
    method: 'GET',
  });
}
