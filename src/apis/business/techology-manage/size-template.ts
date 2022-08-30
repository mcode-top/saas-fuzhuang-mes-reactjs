import type {
  BusSizeTemplateItemType,
  BusSizeTemplateParentType,
} from './../../../pages/business/techology-manage/SizeTemplate/typing';
import { request } from 'umi';
import type { SizeTemplateItemPageParamQuery } from './typing';

/**@name 创建尺码模板 */
export function fetchCreateSizeTemplateParent(data: BusSizeTemplateParentType) {
  return request<RESULT_SUCCESS<any>>('/size-template/parent', {
    method: 'POST',
    data,
  });
}
/**@name 更新尺码模板 */
export function fetchUpdateSizeTemplateParent(data: BusSizeTemplateParentType & { id: number }) {
  return request<RESULT_SUCCESS<any>>('/size-template/parent', {
    method: 'PATCH',
    data,
  });
}
/**@name 删除单个尺码模板 */
export function fetchRemoveOneParent(id: number) {
  return request<RESULT_SUCCESS<any>>('/size-template/parent/remove/' + id, {
    method: 'Post',
  });
}

/**@name 创建尺码 */
export function fetchCreateSizeTemplateItem(data: BusSizeTemplateItemType) {
  return request<RESULT_SUCCESS<any>>('/size-template/item', {
    method: 'POST',
    data,
  });
}
/**@name 更新尺码 */
export function fetchUpdateSizeTemplateItem(data: BusSizeTemplateItemType & { id: number }) {
  return request<RESULT_SUCCESS<any>>('/size-template/item', {
    method: 'PATCH',
    data,
  });
}
/**@name 批量删除尺码 */
export function fetchManyRemoveSizeTemplateItem(ids: number[]) {
  return request<RESULT_SUCCESS<any>>('/size-template/item/many-remove', {
    method: 'POST',
    data: { ids },
  });
}

/**@name 尺码分页 */
export function fetchSizeTemplateItemList(
  data: PAGINATION_QUERY.Param<SizeTemplateItemPageParamQuery>,
) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusSizeTemplateItemType>>>(
    '/size-template/item/page',
    {
      method: 'POST',
      data,
    },
  );
}

/**@name 获取全部尺码模板列表(仅name与id) */
export function fetchNameListSizeTemplateParent() {
  return request<RESULT_SUCCESS<(BusSizeTemplateParentType & { id: number })[]>>(
    '/size-template/parent/all/name-to-id',
    {
      method: 'GET',
    },
  );
}
/**@name 获取全部尺码模板列表(仅name与id) */
export function fetchNameListSizeTemplateItem(selectId) {
  return request<RESULT_SUCCESS<{ name: string; id: number }[]>>(
    '/size-template/item/all/name-to-id/' + selectId,
    {
      method: 'GET',
    },
  );
}
/**@name 获取全部尺码模板列表(仅name与id) */
export function fetchTressSizeTemplate() {
  return request<
    RESULT_SUCCESS<(BusSizeTemplateParentType & { children: BusSizeTemplateItemType[] })[]>
  >('/size-template/tree', {
    method: 'GET',
  });
}
