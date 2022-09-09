import { request } from 'umi';
import type { DraftsPageParamQuery, DraftsType } from './typing';

/**@name 创建草稿箱 */
export function fetchCreateDrafts(data: DraftsType) {
  return request<RESULT_SUCCESS<any>>('/drafts', {
    method: 'POST',
    data,
  });
}
/**@name 更新草稿箱 */
export function fetchUpdateDrafts(data: DraftsType & { id: number }) {
  return request<RESULT_SUCCESS<any>>('/drafts', {
    method: 'PATCH',
    data,
  });
}

/**@name 草稿箱分页 */
export function fetchDraftsList(data: PAGINATION_QUERY.Param<DraftsPageParamQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<DraftsType>>>('/drafts/page', {
    method: 'POST',
    data,
  });
}
/**@name 删除草稿箱 */
export function fetchRemoveDrafts(id: number) {
  return request<RESULT_SUCCESS<any>>('/drafts/remove/' + id, {
    method: 'POST',
  });
}
/**@name 查看草稿箱 */
export function fetchWatchDrafts(id: number) {
  return request<RESULT_SUCCESS<any>>('/drafts/' + id, {
    method: 'GET',
  });
}
