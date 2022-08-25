/**
 * 尺码管理
 */

import {
  fetchManyRemoveSizeTemplateItem,
  fetchSizeTemplateItemList,
} from '@/apis/business/techology-manage/size-template';
import LoadingButton from '@/components/Comm/LoadingButton';
import { nestPaginationTable } from '@/utils/proTablePageQuery';
import { SettingOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, message, Space, Table } from 'antd';
import react, { useEffect, useRef } from 'react';

import React from 'react';
import { Access } from 'umi';
import SizeTemplateItemTableModal from './TableModal';
import type { BusSizeTemplateItemType, BusSizeTemplateParentType } from './typing';

/**@name 表格栏操作 */
const TableBarDom = (action: ActionType | undefined, selectId: number | undefined) => {
  return [
    selectId === undefined ? null : (
      <SizeTemplateItemTableModal
        selectId={selectId}
        key="新增尺码"
        title="新增尺码"
        node={{ type: 'create' }}
        onFinish={() => {
          message.success('新增成功');
          action?.reload();
        }}
      >
        <Button type="primary" key="create">
          新增尺码
        </Button>
      </SizeTemplateItemTableModal>
    ),
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
          await fetchManyRemoveSizeTemplateItem(props.selectedRowKeys as number[]).then(() => {
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
  record: BusSizeTemplateItemType;
  action: ActionType | undefined;
  selectId: number;
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
                <SizeTemplateItemTableModal
                  selectId={props.selectId}
                  title="查看尺码"
                  node={{ type: 'watch', value: props.record }}
                >
                  <span>查看尺码</span>
                </SizeTemplateItemTableModal>
              ),
            },
            {
              key: 'modify',
              label: (
                <SizeTemplateItemTableModal
                  selectId={props.selectId}
                  key="修改尺码"
                  title="修改尺码"
                  onFinish={() => {
                    message.success('修改成功');
                    props?.action?.reload();
                  }}
                  node={{ type: 'update', value: props.record }}
                >
                  <span>修改尺码</span>
                </SizeTemplateItemTableModal>
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

const BusSizeTemplateTable: React.FC<{
  selectId: number | undefined;
  selectNode: BusSizeTemplateParentType | undefined;
}> = (props) => {
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    actionRef.current?.reload();
  }, [props.selectId]);
  const columns: ProColumns<BusSizeTemplateItemType>[] = [
    {
      title: '尺码名称',
      dataIndex: 'name',
    },
    {
      title: '尺码规格',
      dataIndex: 'specification',
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
        return (
          <TableOperationDom selectId={props.selectId as any} record={record} action={action} />
        );
      },
    },
  ];
  return (
    <ProTable
      columns={columns}
      rowKey="id"
      headerTitle={
        props.selectId === undefined
          ? '全部尺码列表'
          : `${props.selectNode?.name}${
              props.selectNode?.remark ? `(${props.selectNode?.remark})` : ''
            }尺码列表`
      }
      actionRef={actionRef}
      tableAlertOptionRender={({ selectedRowKeys }) => {
        return <TableAlertOptionDom selectedRowKeys={selectedRowKeys} action={actionRef.current} />;
      }}
      toolBarRender={(action) => TableBarDom(action, props.selectId)}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        defaultSelectedRowKeys: [],
        type: 'checkbox',
      }}
      request={async (params, sort, filter) => {
        return nestPaginationTable(params, sort, filter, (data) => {
          return fetchSizeTemplateItemList({
            ...data,
            query: { ...data.query, parentId: props.selectId },
          });
        });
      }}
    />
  );
};

export default BusSizeTemplateTable;
