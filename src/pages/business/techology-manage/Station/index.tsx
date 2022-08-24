/**
 * 工位管理
 */
import { fetchManyRemoveStation, fetchStationList } from '@/apis/business/techology-manage/station';
import type { UserListItem } from '@/apis/person/typings';
import { fetchUserList } from '@/apis/person/users';
import LoadingButton from '@/components/Comm/LoadingButton';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Space, Table } from 'antd';
import react, { useRef } from 'react';

import React from 'react';
import { Access } from 'umi';
import StationTableModal from './TableModal';
import type { BusStationType } from './typing';

/**@name 表格栏操作 */
const TableBarDom = (action: ActionType | undefined) => {
  return [
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
    </StationTableModal>,
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

function formatUserList(data: BusStationType) {
  if (Array.isArray(data?.userList)) {
    return { ...data, userList: data?.userList?.map((u: any) => u.id) || [] };
  }
  return data;
}

/**@name 表格操作行 */
const TableOperationDom: React.FC<{
  record: BusStationType;
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
                <StationTableModal
                  title="查看工位"
                  node={{ type: 'watch', value: formatUserList(props.record) }}
                >
                  <span>查看工位</span>
                </StationTableModal>
              ),
            },
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
                  node={{ type: 'update', value: formatUserList(props.record) }}
                >
                  <span>修改工位</span>
                </StationTableModal>
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

const BusStation: React.FC = () => {
  const actionRef = useRef<ActionType>();

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
      title: '绑定员工',
      ellipsis: true,
      dataIndex: 'userList',
      renderText(text, record, index, action) {
        console.log('====================================');
        console.log(text);
        console.log('====================================');
        return text?.map((u) => u.name).join(',');
      },
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
