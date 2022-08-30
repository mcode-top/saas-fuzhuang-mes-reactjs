import {
  fetchCurrentCustomerContacterList,
  fetchRemoveCustomerContacter,
} from '@/apis/business/customer';
import type {
  BusCustomerCompanyType,
  BusCustomerContacterType,
} from '@/apis/business/customer/typing';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Popconfirm, Space, Table } from 'antd';
import React, { useEffect } from 'react';
import BusCustomerContacterModal from './CustomerContacterModal';

const CustomerContacterList: React.FC<{
  record: BusCustomerCompanyType;
}> = (props) => {
  const actionRef = React.useRef<ActionType | undefined>(null);
  useEffect(() => {
    actionRef.current?.reload();
  }, [props.record]);
  const colunms: ProColumns<any>[] = [
    { title: '联系人姓名', dataIndex: 'name' },
    { title: '联系人电话', dataIndex: 'phone' },
    { title: '联系人部门', dataIndex: 'dept' },
    { title: '联系人职称', dataIndex: 'role' },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    {
      title: '操作',
      dataIndex: 'option',
      render(t, value) {
        return (
          <Space>
            <BusCustomerContacterModal
              key="update"
              title={`修改[${props.record.name}]的联系人`}
              onFinish={() => {
                actionRef.current?.reload?.();
              }}
              node={{ type: 'update', value: { companyId: props.record.id, ...value } }}
            >
              <Button type="link">修改</Button>
            </BusCustomerContacterModal>
            <Popconfirm
              key="Popconfirm"
              title="您确定要删除当前客户联系人吗？"
              onConfirm={async () => {
                await fetchRemoveCustomerContacter(value.id);
                actionRef.current?.reload?.();
              }}
              okText="确认删除"
              cancelText="不删除"
            >
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <ProTable<BusCustomerContacterType>
      columns={colunms}
      cardProps={{ bodyStyle: { padding: 0 } }}
      headerTitle="客户联系人"
      actionRef={actionRef}
      request={async (params, sorter, filter) => {
        const { data } = await fetchCurrentCustomerContacterList(props.record.id);
        return {
          data,
        };
      }}
      toolbar={{
        actions: [
          <BusCustomerContacterModal
            key="create"
            title={`新增[${props.record.name}]的联系人`}
            node={{ type: 'create', value: { companyId: props.record.id } }}
            onFinish={() => {
              actionRef.current?.reload?.();
            }}
          >
            <Button key="primary" type="primary">
              新增联系人
            </Button>
          </BusCustomerContacterModal>,
        ],
      }}
      rowKey="id"
      search={false}
      dateFormatter="string"
    />
  );
};
export default CustomerContacterList;
