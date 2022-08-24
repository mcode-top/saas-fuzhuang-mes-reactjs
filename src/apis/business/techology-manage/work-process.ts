import { BusWorkProcessType } from "@/pages/business/techology-manage/WorkProcess/typing";
import { request } from "umi";
import { WorkProcessPageParamQuery } from "./typeing";

/**@name 创建工序 */
export function fetchCreateWorkProcess(data: BusWorkProcessType) {
  return request<RESULT_SUCCESS<any>>(
    '/work-process',
    {
      method: 'POST',
      data
    },
  );
}
/**@name 更新工序 */
export function fetchUpdateWorkProcess(data: BusWorkProcessType & { id: number }) {
  return request<RESULT_SUCCESS<any>>(
    '/work-process',
    {
      method: 'Patch',
      data
    },
  );
}

/**@name 工序分页 */
export function fetchWorkProcessList(data: PAGINATION_QUERY.Param<WorkProcessPageParamQuery>) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<BusWorkProcessType>>>("/work-process/page", {
    method: "POST",
    data
  })
}
/**@name 批量删除工序 */
export function fetchManyRemoveWorkProcess(ids: number[]) {
  return request<RESULT_SUCCESS<any>>("/work-process/many-remove", {
    method: "POST",
    data: { ids }
  })
}