import { request } from 'umi';
import type {
  BusOrderCreateDeliveryDto,
  BusOrderDeliveryApproveTaskDto,
  BusOrderDeliveryEntity,
  BusOrderUpdateDeliveryDto,
} from './typing';

/**@name 发货单分页 */
export function fetchOrderDeliveryList(data: PAGINATION_QUERY.Param) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusOrderDeliveryEntity>>>(
    '/delivery/page',
    {
      method: 'POST',
      data,
    },
  );
}

/**@name 创建发货单 */
export function fetchOrderCreateDelivery(data: BusOrderCreateDeliveryDto) {
  return request<RESULT_SUCCESS>('/delivery/create', {
    method: 'POST',
    data,
  });
}
/**@name 审核发货单 */
export function fetchOrderApproveDelivery(data: BusOrderDeliveryApproveTaskDto) {
  return request<RESULT_SUCCESS>('/delivery/approve', {
    method: 'POST',
    data,
  });
}
/**@name 修改发货单 */
export function fetchOrderUpdateDelivery(deliveryId: number, data: BusOrderUpdateDeliveryDto) {
  return request<RESULT_SUCCESS>('/delivery/update/' + deliveryId, {
    method: 'PATCH',
    data,
  });
}
/**@name 查看发货单 */
export function fetchOrderWatchDelivery(deliveryId: number) {
  return request<RESULT_SUCCESS<BusOrderDeliveryEntity>>('/delivery/' + deliveryId, {
    method: 'GET',
  });
}
