import type { BusStationType } from '@/pages/business/techology-manage/Station/typing';
import { request } from 'umi';
import type { StationPageParamQuery } from './typing';

/**@name 创建工位 */
export function fetchCreateStation(data: BusStationType) {
  return request<RESULT_SUCCESS<any>>('/station', {
    method: 'POST',
    data,
  });
}
/**@name 更新工位 */
export function fetchUpdateStation(data: BusStationType & { id: number }) {
  return request<RESULT_SUCCESS<any>>('/station', {
    method: 'PATCH',
    data,
  });
}

/**@name 工位分页 */
export function fetchStationList(data: PAGINATION_QUERY.Param<StationPageParamQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusStationType>>>('/station/page', {
    method: 'POST',
    data,
  });
}
/**@name 批量删除工位 */
export function fetchManyRemoveStation(ids: number[]) {
  return request<RESULT_SUCCESS<any>>('/station/many-remove', {
    method: 'POST',
    data: { ids },
  });
}
/**@name 获取全部工位列表(仅name与id) */
export function fetchNameListStation() {
  return request<RESULT_SUCCESS<{ name: string; id: number }[]>>('/station/all/name-to-id', {
    method: 'GET',
  });
}
