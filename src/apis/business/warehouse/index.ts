import { omit } from 'lodash';
import type {
  BusWarehouseGoodsType,
  BusWarehouseShelfType,
  BusWarehouseType,
  BusWarehouseGoodsPageParamQuery,
  BusWarehousePutInGoodsDto,
  BusWarehouseGoodsOutInLogPageParamQuery,
  ExcelManyPutInGoodsDto,
  ManyPutOutInDto,
  BusWarehouseGoodQuantityType,
} from './typing';
import { request } from 'umi';

/**@name 创建仓库 */
export function fetchCreateWarehouse(data: Omit<BusWarehouseType, 'id'>) {
  return request('/warehouse', {
    method: 'POST',
    data,
  });
}
/**@name 修改仓库 */
export function fetchUpdateWarehouse(data: Omit<BusWarehouseType, 'type'>) {
  return request('/warehouse', {
    method: 'PATCH',
    data: omit(data, 'type'),
  });
}

/**@name 删除仓库 */
export function fetchRemoveWarehouse(warehouseId: number) {
  return request('/warehouse/remove/' + warehouseId, {
    method: 'POST',
  });
}

/**@name 获取全部仓库列表 */
export function fetchWarehouseList() {
  return request<RESULT_SUCCESS<BusWarehouseType[]>>('/warehouse/list', {
    method: 'GET',
  });
}

/**@name 创建货架 */
export function fetchCreateWarehouseShelf(data: Omit<BusWarehouseShelfType, 'id'>) {
  return request('/warehouse/shelf', {
    method: 'POST',
    data: omit(data, 'id'),
  });
}
/**@name 修改货架 */
export function fetchUpdateWarehouseShelf(data: BusWarehouseShelfType) {
  return request('/warehouse/shelf', {
    method: 'PATCH',
    data,
  });
}

/**@name 删除货架 */
export function fetchRemoveWarehouseShelf(shelfId: number) {
  return request('/warehouse/remove-shelf/' + shelfId, {
    method: 'POST',
  });
}

/**@name 通过仓库ID获取货架列表 */
export function fetchWarehouseIdToShelfList(warehouseId: number) {
  return request<RESULT_SUCCESS<BusWarehouseShelfType[]>>('/warehouse/shelf-list/' + warehouseId, {
    method: 'GET',
  });
}

/**@name 货品出库 */
export function fetchWarehouseGoodsPutOut(data: BusWarehousePutInGoodsDto) {
  return request('/warehouse/goods/put-out', {
    method: 'POST',
    data,
  });
}
/**@name 货品入库 */
export function fetchWarehouseGoodsPutIn(data: BusWarehousePutInGoodsDto) {
  return request('/warehouse/goods/put-in', {
    method: 'POST',
    data,
  });
}

/**@name Excel货品批量入库 */
export function fetchWarehouseExcelManyPutInGoods(data: ExcelManyPutInGoodsDto) {
  return request('/warehouse/goods/excel-put-in', {
    method: 'POST',
    data,
  });
}
/**@name 批量货品出入库 */
export function fetchWarehouseManyPutOutInGoods(data: ManyPutOutInDto) {
  return request('/warehouse/goods/many-put-out-in', {
    method: 'POST',
    data,
  });
}

/**@name 修改货品备注信息 */
export function fetchUpdateWarehouseGoodsRemark(data: { goodsId: number; remark: string }) {
  return request('/warehouse/goods', {
    method: 'Patch',
    data,
  });
}

/**@name 通过货架Id获取货品分页 */
export function fetchShelfIdToGoodsList(
  shelfId: number,
  data: PAGINATION_QUERY.Param<BusWarehouseGoodsPageParamQuery>,
) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusWarehouseGoodsType>>>(
    '/warehouse/goods/page/' + shelfId,
    {
      method: 'POST',
      data,
    },
  );
}
/**@name 通过货品Id获取出入库记录分页 */
export function fetchGoodsIdToOutInLogList(
  goodsId: number,
  data: PAGINATION_QUERY.Param<BusWarehouseGoodsOutInLogPageParamQuery>,
) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusWarehouseGoodsType>>>(
    '/warehouse/log/page/' + goodsId,
    {
      method: 'POST',
      data,
    },
  );
}

/**@name 通过物料编码检查货品库存 */
export function checkMaterialCodeToGoodsQuantity(materialCode: string, sizeId?: number) {
  return request<RESULT_SUCCESS<BusWarehouseGoodQuantityType | null>>(
    '/warehouse/goods/check-quantity',
    {
      method: 'POST',
      data: {
        materialCode,
        sizeId,
      },
    },
  );
}
