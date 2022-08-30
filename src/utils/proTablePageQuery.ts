import { fetchCustomTableList } from '@/apis/custom-form/custom-form';
import type { SortOrder } from 'antd/lib/table/interface';
import * as _ from 'lodash';
import { omit, pick } from 'lodash';
/*
 * @Author: mmmmmmmm
 * @Date: 2022-03-14 14:41:56
 * @Description: 争对ProTable与nestjs程序的分页查询格式化
 */

/**@name  获取Nest分页*/
export async function nestPaginationTable<T>(
  params: Record<string, any> & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
  func: (data: PAGINATION_QUERY.Param) => Promise<RESULT_SUCCESS<PAGINATION_QUERY.Result<T>>>,
) {
  const result = await func({
    page: params.current,
    limit: params.pageSize,
    query: { ..._.omit(params, ['current', 'pageSize', 'keyword']) },
    order: sort,
  });
  return {
    ...omit(result.data, 'items'),
    data: result.data.items,
    success: true,
    total: result.data.meta.totalItems,
  };
}

/**@name  获取Nest自定义表格分页*/
export async function nestPaginationCustomTable(
  businessKey: string,
  params: Record<string, any> & {
    pageSize?: number;
    current?: number;
    keyword?: string;
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, React.ReactText[] | null>,
) {
  const result = await fetchCustomTableList(businessKey as string, {
    page: params.current,
    limit: params.pageSize,
    dataParam: {
      query: omit(params, [
        'operatorId',
        'createdAt',
        'updatedAt',
        'current',
        'pageSize',
        'keyword',
      ]),
      order: omit(sort, ['createdAt', 'updatedAt']),
    },
    /**@name 基础分页参数 */
    basicParam: {
      query: pick(params, ['operatorId', 'createdAt', 'updatedAt']),
      order: pick(sort, ['createdAt', 'updatedAt']),
    },
  });
  return {
    ...omit(result.data, 'items'),
    data: result.data.items,
    success: true,
    total: result.data.meta.totalItems,
  };
}
