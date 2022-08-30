/**
 * 工位管理
 */
import { fetchManyRemoveStation, fetchStationList } from '@/apis/business/techology-manage/station';
import { fetchShelfIdToGoodsList } from '@/apis/business/warehouse';
import type { BusWarehouseGoodsType } from '@/apis/business/warehouse/typing';
import type { UserListItem } from '@/apis/person/typings';
import { fetchUserList } from '@/apis/person/users';
import LoadingButton from '@/components/Comm/LoadingButton';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Space, Table } from 'antd';
import react, { useContext, useRef } from 'react';

import React from 'react';
import { WarehouseContext } from '../context';

/**@name 表格栏操作 */
const TableBarDom = (action: ActionType | undefined) => {
  return [
    // <StationTableModal
    //   key="新增工位"
    //   title="新增工位"
    //   node={{ type: 'create' }}
    //   onFinish={() => {
    //     message.success('新增成功');
    //     action?.reload();
    //   }}
    // >
    //   <Button type="primary" key="create">
    //     新增工位
    //   </Button>
    // </StationTableModal>,
  ];
};

/**@name 表格选择操作 */
const TableAlertOptionDom: React.FC<{
  selectedRowKeys: (string | number)[];
  action: ActionType | undefined;
}> = (props) => {
  return (
    <Space size={16}>
      <LoadingButton
        onLoadingClick={async () =>
          await fetchManyRemoveStation(props.selectedRowKeys as number[]).then(() => {
            props?.action?.clearSelected?.();
            props?.action?.reload();
            message.success('删除成功');
          })
        }
      >
        批量删除
      </LoadingButton>
    </Space>
  );
};

/**@name 表格操作行 */
const TableOperationDom: React.FC<{
  record: BusWarehouseGoodsType;
  action: ActionType | undefined;
}> = (props) => {
  return (
    <Dropdown
      key="Dropdown"
      trigger={['click']}
      overlay={
        <Menu
          key="menu"
          items={[
            {
              key: 'watch',
              label: (
                <div>查看工位</div>
                // <StationTableModal title="查看工位" node={{ type: 'watch', value: props.record }}>
                // </StationTableModal>
              ),
            },
            {
              key: 'modify',
              label: (
                // <StationTableModal
                //   key="修改工位"
                //   title="修改工位"
                //   onFinish={() => {
                //     message.success('修改成功');
                //     props?.action?.reload();
                //   }}
                //   node={{ type: 'update', value: props.record }}
                // >
                // </StationTableModal>
                <div>修改工位</div>
              ),
            },
          ]}
        />
      }
    >
      <Button icon={<SettingOutlined />} type="link">
        更多操作
      </Button>
    </Dropdown>
  );
};

const BusWarehouseGoodsTable: React.FC = () => {
  const wContext = useContext(WarehouseContext);

  const columns: ProColumns<BusWarehouseGoodsType>[] = [
    {
      title: '物料编码',
      dataIndex: 'materialCode',
    },
    {
      title: '库存数量',
      dataIndex: 'quantity',
    },
    {
      title: '备注信息',
      ellipsis: true,
      dataIndex: 'remark',
    },
    {
      title: '操作',
      fixed: 'right',
      width: 150,
      hideInSearch: true,
      key: 'operation',
      render: (dom, record, index, action) => {
        return <TableOperationDom record={record} action={action} />;
      },
    },
  ];
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      headerTitle="货品列表"
      actionRef={wContext.goodsAction}
      // tableAlertOptionRender={({ selectedRowKeys }) => {
      //   return <TableAlertOptionDom selectedRowKeys={selectedRowKeys} action={actionRef.current} />;
      // }}
      toolBarRender={TableBarDom}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        defaultSelectedRowKeys: [],
        type: 'checkbox',
      }}
      request={async (params, sort, filter) => {
        if (!wContext.currentShelfNode?.id) {
          return {
            data: [],
          };
        }
        return nestPaginationTable(params, sort, filter, (data) =>
          fetchShelfIdToGoodsList(wContext.currentShelfNode?.id as number, data),
        );
      }}
    />
  );
};

export default BusWarehouseGoodsTable;
