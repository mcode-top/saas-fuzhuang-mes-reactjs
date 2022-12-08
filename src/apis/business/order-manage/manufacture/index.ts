import type { ApproveTaskDto } from '@/apis/process/typings';
import { request } from 'umi';
import type {
  BusOrderManufacture,
  BusWorkProcessPrice,
  ManufactureGoodsPutInStockDto,
  UpdateManufactureDto,
} from './typing';

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
  return request<RESULT_SUCCESS<any>>('/manufacture/approve/' + id, {
    method: 'POST',
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
/**@name 获取生产单中的工序工价列表 */
export function fetchWorkProcessWorkPiriceList(id: number) {
  return request<RESULT_SUCCESS<BusWorkProcessPrice[]>>('/manufacture/work-process-price/' + id, {
    method: 'GET',
  });
}
/**@name 删除生产单 */
export function fetchRemoveManufacture(id: number) {
  return request<RESULT_SUCCESS<any>>('/manufacture/remove/' + id, {
    method: 'POST',
  });
}
/**@name 检查生产流程是否可撤回 */
export function fetchCheckManufactureIsRecall(id: number) {
  return request<RESULT_SUCCESS<any>>('/manufacture/check-recall/' + id, {
    method: 'POST',
  });
}
/**@name 生产单货品入库 */
export function fetchManufactureGoodsPutInStock(data: ManufactureGoodsPutInStockDto) {
  return request<RESULT_SUCCESS<any>>('/manufacture/put-in-stock', {
    method: 'POST',
    data,
  });
}
/**@name 确认生产单完成 */
export function fetchConfirmManufactureOrderComplete(manufactureId: number) {
  return request<RESULT_SUCCESS<any>>('/manufacture/confirm-complete/' + manufactureId, {
    method: 'POST',
  });
}
