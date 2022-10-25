import {
  fetchCurrentCustomerContacterList,
  fetchManyExportExcelContacter,
  fetchRemoveCustomerContacter,
} from '@/apis/business/customer';
import type {
  BusCustomerCompanyType,
  BusCustomerContacterType,
} from '@/apis/business/customer/typing';
import { STORAGE_CUSTOMER_CONTACTER_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message, Popconfirm, Space, Table } from 'antd';
import React, { useEffect } from 'react';
import { busCustomerContacterExportExcelTemplate, busCustomerContacterImportExcel } from '../excel';
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
        const { data } = await storageDataSource.getValue(
          STORAGE_CUSTOMER_CONTACTER_LIST,
          true,
          props.record.id,
        );
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
            <Button key="新增联系人" type="primary">
              新增联系人
            </Button>
          </BusCustomerContacterModal>,
          <Button
            key="批量导入客户联系人"
            onClick={() => {
              busCustomerContacterImportExcel().then((res) => {
                if (res) {
                  const result = res.filter((i) => {
                    return i.name !== '' && i.phone !== '';
                  });
                  const loadingCustomer = message.loading('正在批量导入客户联系人', 0);
                  fetchManyExportExcelContacter(props.record.id, result)
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
            批量导入客户联系人
          </Button>,
          <Button
            key="下载客户联系人模板"
            onClick={() => busCustomerContacterExportExcelTemplate(props.record.name)}
          >
            下载客户联系人模板
          </Button>,
        ],
      }}
      rowKey="id"
      search={false}
      dateFormatter="string"
    />
  );
};
export default CustomerContacterList;
