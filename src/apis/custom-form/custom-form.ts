import { request } from 'umi';
import type { CustomFormQueryAuth, CustomFormTableType, CustomTableDataItem } from './typings';

/**@name 获取自定义表模型 */
export function fetchTableModel(businessKey: string) {
  return request<
    RESULT_SUCCESS<{
      id: number;
      createdAt: Date;
      updatedAt: Date;
      tableName: string;
      businessKey: string;
      tableModel: {
        colunms: CustomFormTableType[];
        relation: any;
      };
      queryAuth: CustomFormQueryAuth;
    }>
  >('/custom-form/table-model/' + businessKey, {
    method: 'GET',
  });
}

/**@name 获取自定义表分页 */
export function fetchCustomTableList(
  businessKey: string,
  data: {
    page?: number;
    limit?: number;
    dataParam?: { query: any; order: any };
    basicParam?: { order: any; query: any };
  },
) {
  return request<RESULT_SUCCESS<PAGINATION_QUERY.Result<CustomTableDataItem>>>(
    '/custom-form/paginate/' + businessKey,
    {
      method: 'POST',
      data,
    },
  );
}
