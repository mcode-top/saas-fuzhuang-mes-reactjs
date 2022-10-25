import {
  fetchCurrentCustomerAddressList,
  fetchCurrentCustomerContacterList,
  fetchManyExportExcelAddress,
  fetchRemoveCustomerAddress,
  fetchRemoveCustomerContacter,
} from '@/apis/business/customer';
import type {
  BusCustomerCompanyType,
  BusCustomerAddressType,
} from '@/apis/business/customer/typing';
import { STORAGE_CUSTOMER_ADDRESS_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import React, { useEffect } from 'react';
import { busCustomerAddressExportExcelTemplate, busCustomerAddressImportExcel } from '../excel';
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
        const { data } = await storageDataSource.getValue(
          STORAGE_CUSTOMER_ADDRESS_LIST,
          true,
          props.record.id,
        );
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
          <Button
            key="批量导入客户联系人"
            onClick={() => {
              busCustomerAddressImportExcel().then((res) => {
                if (res) {
                  const result = res.filter((i) => {
                    return i.name !== '' && i.phone !== '';
                  });
                  const loadingCustomer = message.loading('正在批量导入客户地址', 0);
                  fetchManyExportExcelAddress(props.record.id, result)
                    .then(() => {
                      actionRef.current?.reload();
                      message.success('导入成功');
                    })
                    .finally(() => {
                      loadingCustomer();
                    });
                }
                props.record.id;
              });
            }}
          >
            批量导入客户地址
          </Button>,
          <Button
            key="下载客户联系人模板"
            onClick={() => busCustomerAddressExportExcelTemplate(props.record.name)}
          >
            下载客户地址模板
          </Button>,
        ],
      }}
      rowKey="id"
      search={false}
      dateFormatter="string"
    />
  );
};
export default CustomerAddressList;
