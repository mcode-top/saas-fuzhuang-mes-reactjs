import type { BusMaterialTypeEnum } from '@/pages/business/techology-manage/Material/typing';
import type { BusMaterialType } from '@/pages/business/techology-manage/Material/typing';
import { request } from 'umi';
import type { MaterialPageParamQuery } from './typing';

/**@name 创建物料 */
export function fetchCreateMaterial(data: BusMaterialType) {
  return request<RESULT_SUCCESS<any>>('/material', {
    method: 'POST',
    data,
  });
}

/**@name 批量新增物料 */
export function fetchManyCreateMaterial(data: BusMaterialType[]) {
  return request<RESULT_SUCCESS<any>>('/material/many-create', {
    method: 'POST',
    data,
  });
}
/**@name 更新物料 */
export function fetchUpdateMaterial(data: BusMaterialType & { id: number }) {
  return request<RESULT_SUCCESS<any>>('/material', {
    method: 'PATCH',
    data,
  });
}

/**@name 物料分页 */
export function fetchMaterialList(data: PAGINATION_QUERY.Param<MaterialPageParamQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusMaterialType>>>('/material/page', {
    method: 'POST',
    data,
  });
}
/**@name 批量删除物料 */
export function fetchManyRemoveMaterial(codes: string[]) {
  return request<RESULT_SUCCESS<any>>('/material/many-remove', {
    method: 'POST',
    data: { codes },
  });
}
/**@name 根据搜索编码获取物料列表(仅name与code) */
export function fetchNameListMaterial(data: { search: string; type?: BusMaterialTypeEnum }) {
  return request<RESULT_SUCCESS<{ name: string; code: number }[]>>('/material/all/name-to-id', {
    method: 'GET',
    params: data,
  });
}

/**@name 根据搜索编码获取物料列表(仅name与code) */
export function fetchCheckMaterialCode(codes: string[]) {
  return request<
    RESULT_SUCCESS<{
      existCodes: string[];
      notExistCodes: string[];
    }>
  >('/material/check', {
    method: 'POST',
    data: {
      codes,
    },
  });
}
