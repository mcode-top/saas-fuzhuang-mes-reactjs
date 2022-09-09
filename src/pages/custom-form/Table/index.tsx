/*
 * @Author: mmmmmmmm
 * @Date: 2022-04-25 09:32:34
 * @Description: 自定义表格渲染
 */
import { fetchCustomTableList } from '@/apis/custom-form/custom-form';
import storageDataSource from '@/utils/storage';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { ProColumnType } from '@ant-design/pro-table';
import { Empty, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'umi';
import { CUSTOM_TABLE_BUSINESS_KEY_TO_TABLE_MODEL } from '../custom-form.config';
import { nestPaginationCustomTable } from '@/utils/proTablePageQuery';
import { CustomTableColumnToAntDColumns } from '../custom-form.helper';

const CustomTableViewer: React.FC = () => {
  /**@name 自定义表格路由必须是/xxxx/xxxx/:businessKey */
  const urlParams = {
    businessKey: 'delegation',
  };
  const [columns, setColumns] = useState<ProColumns[]>([]);

  useEffect(() => {
    /**初始化 */
    storageDataSource
      .getValue(CUSTOM_TABLE_BUSINESS_KEY_TO_TABLE_MODEL, false, {
        businessKey: urlParams.businessKey,
      })
      .then((result) => {
        setColumns(CustomTableColumnToAntDColumns(result.tableModel.columns));
      });
  }, []);
  if (!urlParams.businessKey) {
    return <Empty description="路由设定有误" />;
  }
  if (columns.length === 0) {
    return <Skeleton active />;
  }
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      request={async (params, sort, filter) => {
        return await nestPaginationCustomTable(urlParams.businessKey, params, sort, filter).then(
          (res) => {
            console.log(res);
            return res;
          },
        );
      }}
    />
  );
};

export default CustomTableViewer;
