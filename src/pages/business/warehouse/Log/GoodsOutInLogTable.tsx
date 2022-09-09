import { fetchGoodsIdToOutInLogList } from '@/apis/business/warehouse';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { ProFormDigitRange } from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { WarehouseTypeValueEnum } from '@/configs/commValueEnum';

const BusGoodsOutInLogTable: React.FC<{ goodsId: number }> = (props) => {
  const columns: ProColumns<BusWarehouseGoodsType>[] = [
    {
      title: '操作人',
      ellipsis: true,
      dataIndex: 'operatorName',
      renderText(text, record, index, action) {
        return record?.operator?.name;
      },
      width: 150,
    },
    {
      title: '库存变更数量',
      dataIndex: 'changeNumber',
      sorter: true,
      width: 120,
      renderFormItem: () => {
        return <ProFormDigitRange placeholder="查询库存范围" />;
      },
    },

    {
      title: '库存变更类型',
      dataIndex: 'type',
      width: 100,
      valueEnum: WarehouseTypeValueEnum.LogType,
      valueType: 'select',
    },

    {
      title: '出入库时间',
      key: 'showTime',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      sorter: true,
      width: 150,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '库存变更原因',
      ellipsis: true,
      dataIndex: 'remark',
    },
  ];
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      headerTitle="出入库记录列表"
      size="small"
      search={{
        filterType: 'light',
      }}
      pagination={{
        pageSize: 10,
        size: 'small',
      }}
      request={async (params, sort, filter) => {
        if (!props.goodsId) {
          return {
            data: [],
          };
        }
        return nestPaginationTable(params, sort, filter, (data) =>
          fetchGoodsIdToOutInLogList(props.goodsId, data),
        );
      }}
    />
  );
};

export default BusGoodsOutInLogTable;
