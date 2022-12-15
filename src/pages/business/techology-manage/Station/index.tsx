/**
 * 工位管理
 */
import { fetchManyRemoveStation, fetchStationList } from '@/apis/business/techology-manage/station';
import { ApiMethodEnum, UserListItem } from '@/apis/person/typings';
import { fetchUserList } from '@/apis/person/users';
import LoadingButton from '@/components/Comm/LoadingButton';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Space, Table } from 'antd';
import react, { useRef } from 'react';

import React from 'react';
import { Access, useAccess } from 'umi';
import StationTableModal from './TableModal';
import type { BusStationType } from './typing';

/**@name 表格选择操作 */
const TableAlertOptionDom: React.FC<{
  selectedRowKeys: (string | number)[];
  action: ActionType | undefined;
}> = (props) => {
  const access = useAccess();

  return (
    <Space size={16}>
      <Access
        accessible={access.checkShowAuth('/station/many-remove', ApiMethodEnum.POST)}
        key="create"
      >
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
      </Access>
    </Space>
  );
};

/**@name 表格操作行 */
const TableOperationDom: React.FC<{
  record: BusStationType;
  action: ActionType | undefined;
}> = (props) => {
  const access = useAccess();

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
                <StationTableModal
                  title="查看工位"
                  node={{
                    type: 'watch',
                    value: {
                      stationId: props.record.id as number,
                    },
                  }}
                >
                  <div>查看工位</div>
                </StationTableModal>
              ),
            },
            ...(access.checkShowAuth('/station', ApiMethodEnum.PATCH)
              ? [
                  {
                    key: 'modify',
                    label: (
                      <StationTableModal
                        key="修改工位"
                        title="修改工位"
                        onFinish={() => {
                          message.success('修改成功');
                          props?.action?.reload();
                        }}
                        node={{
                          type: 'update',
                          value: {
                            stationId: props.record.id as number,
                          },
                        }}
                      >
                        <div>修改工位</div>
                      </StationTableModal>
                    ),
                  },
                ]
              : []),
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
  const access = useAccess();

  /**@name 表格栏操作 */
  const TableBarDom = (action: ActionType | undefined) => {
    return [
      <Access accessible={access.checkShowAuth('/station', ApiMethodEnum.POST)} key="create">
        <StationTableModal
          key="新增工位"
          title="新增工位"
          node={{ type: 'create' }}
          onFinish={() => {
            message.success('新增成功');
            action?.reload();
          }}
        >
          <Button type="primary" key="create">
            新增工位
          </Button>
        </StationTableModal>
      </Access>,
    ];
  };

  const columns: ProColumns<BusStationType>[] = [
    {
      title: '工位名称',
      dataIndex: 'name',
    },
    {
      title: '工位设备',
      dataIndex: 'device',
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
      headerTitle="工位列表"
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
        return nestPaginationTable(params, sort, filter, fetchStationList);
      }}
    />
  );
};

export default BusStation;
