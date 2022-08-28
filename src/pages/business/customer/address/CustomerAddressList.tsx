import {
  fetchCurrentCustomerAddressList,
  fetchCurrentCustomerContacterList,
  fetchRemoveCustomerAddress,
  fetchRemoveCustomerContacter,
} from '@/apis/business/customer';
import { BusCustomerCompanyType, BusCustomerAddressType } from '@/apis/business/customer/typing';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { Button, Popconfirm, Space, Table } from 'antd';
import React, { useEffect } from 'react';
import BusCustomerAddressModal from './CustomerAddressModal';

const CustomerAddressList: React.FC<{
  record: BusCustomerCompanyType;
}> = (props) => {
  const actionRef = React.useRef<ActionType | undefined>(null);
  useEffect(() => {
    actionRef.current?.reload();
  }, [props.record]);
  const colunms: ProColumns<any>[] = [
    { title: '收货人姓名', dataIndex: 'name' },
    { title: '收货人电话', dataIndex: 'phone' },
    { title: '收货地址', dataIndex: 'address' },
    { title: '备注', dataIndex: 'remark', ellipsis: true },
    {
      title: '操作',
      dataIndex: 'option',
      render(t, value) {
        return (
          <Space>
            <BusCustomerAddressModal
              key="update"
              title={`修改[${props.record.name}]的收货地址`}
              onFinish={() => {
                actionRef.current?.reload?.();
              }}
              node={{ type: 'update', value: { companyId: props.record.id, ...value } }}
            >
              <Button type="link">修改</Button>
            </BusCustomerAddressModal>
            <Popconfirm
              key="Popconfirm"
              title="您确定要删除当前客户收货地址吗？"
              onConfirm={async () => {
                await fetchRemoveCustomerAddress(value.id);
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
    <ProTable<BusCustomerAddressType>
      columns={colunms}
      cardProps={{ bodyStyle: { padding: 0 } }}
      headerTitle="客户收货地址"
      actionRef={actionRef}
      request={async (params, sorter, filter) => {
        const { data } = await fetchCurrentCustomerAddressList(props.record.id);
        return {
          data,
        };
      }}
      toolbar={{
        actions: [
          <BusCustomerAddressModal
            key="create"
            title={`新增[${props.record.name}]的收货地址`}
            node={{ type: 'create', value: { companyId: props.record.id } }}
            onFinish={() => {
              actionRef.current?.reload?.();
            }}
          >
            <Button key="primary" type="primary">
              新增收货地址
            </Button>
          </BusCustomerAddressModal>,
        ],
      }}
      rowKey="id"
      search={false}
      dateFormatter="string"
    />
  );
};
export default CustomerAddressList;
