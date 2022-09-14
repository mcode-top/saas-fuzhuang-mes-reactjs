import type { ApproveTaskDto } from '@/apis/process/typings';
import { request } from 'umi';
import type { BusOrderManufacture, UpdateManufactureDto } from './typing';

/**@name 开始生产单 */
export function fetchStartManufacture(id: number, data: UpdateManufactureDto) {
  return request<RESULT_SUCCESS<any>>('/manufacture/start/' + id, {
    method: 'POST',
    data,
  });
}
/**@name 修改生产单 */
export function fetchUpdateManufacture(id: number, data: UpdateManufactureDto) {
  return request<RESULT_SUCCESS<any>>('/manufacture/update/' + id, {
    method: 'PATCH',
    data,
  });
}

/**@name 审核生产单 */
export function fetchApproveManufacture(id: number, data: ApproveTaskDto) {
  return request<RESULT_SUCCESS<any>>('/manufacture/approve' + id, {
    method: 'PATCH',
    data,
  });
}

/**@name 生产单分页 */
export function fetchManufactureList(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusOrderManufacture>>>(
    '/manufacture/page',
    {
      method: 'POST',
      data,
    },
  );
}
export function fetchReadManufacture(id: number) {
  return request<RESULT_SUCCESS<BusOrderManufacture>>('/manufacture/' + id, {
    method: 'GET',
  });
}
/**@name 删除生产单 */
export function fetchRemoveManufacture(id: number) {
  return request<RESULT_SUCCESS<any>>('/manufacture/remove/' + id, {
    method: 'POST',
  });
}
