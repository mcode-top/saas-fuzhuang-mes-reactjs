/**
 * 工价管理
 */
import {
  fetchManyRemoveWorkPrice,
  fetchWorkPriceList,
} from '@/apis/business/techology-manage/work-price';
import LoadingButton from '@/components/Comm/LoadingButton';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Space, Table } from 'antd';
import react, { useRef } from 'react';

import React from 'react';
import { Access } from 'umi';
import WorkPriceTableModal, { busWorkPriceExportExcel } from './TableModal';
import type { BusWorkPriceType } from './typing';

/**@name 表格栏操作 */
const TableBarDom = (action: ActionType | undefined) => {
  return [
    <WorkPriceTableModal
      key="新增工价"
      title="新增工价"
      node={{ type: 'create' }}
      onFinish={() => {
        message.success('新增成功');
        action?.reload();
      }}
    >
      <Button type="primary" key="create">
        新增工价
      </Button>
    </WorkPriceTableModal>,
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
          await fetchManyRemoveWorkPrice(props.selectedRowKeys as number[]).then(() => {
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
  record: BusWorkPriceType;
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
                <WorkPriceTableModal title="查看工价" node={{ type: 'watch', value: props.record }}>
                  <div>查看工价</div>
                </WorkPriceTableModal>
              ),
            },
            {
              key: 'modify',
              label: (
                <WorkPriceTableModal
                  key="修改工价"
                  title="修改工价"
                  onFinish={() => {
                    message.success('修改成功');
                    props?.action?.reload();
                  }}
                  node={{ type: 'update', value: props.record }}
                >
                  <div>修改工价</div>
                </WorkPriceTableModal>
              ),
            },
            {
              key: 'export',
              label: '导出工价',
              onClick: () => {
                console.log(props.record);

                busWorkPriceExportExcel(props.record.name, props.record.data);
              },
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

const BusStation: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<BusWorkPriceType>[] = [
    {
      title: '工价名称',
      dataIndex: 'name',
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
      headerTitle="工价列表"
      actionRef={actionRef}
      tableAlertOptionRender={({ selectedRowKeys }) => {
        return <TableAlertOptionDom selectedRowKeys={selectedRowKeys} action={actionRef.current} />;
      }}
      toolBarRender={TableBarDom}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        defaultSelectedRowKeys: [],
        type: 'checkbox',
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, fetchWorkPriceList);
      }}
    />
  );
};

export default BusStation;
