import { fetchCustomerCompanyList } from '@/apis/business/customer';
import type { BusCustomerCompanyType } from '@/apis/business/customer/typing';
import type { SimpleColumnListRef } from '@/components/Comm/SimpleColumnList';
import SimpleColumnList from '@/components/Comm/SimpleColumnList';
import { STORAGE_CUSTOMER_COMPANY_LIST } from '@/configs/storage.config';
import storageDataSource from '@/utils/storage';
import {
  MinusOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SelectOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { Button, Card, Divider, Input, Space, Table, Tooltip } from 'antd';
import React from 'react';
import { useState } from 'react';
import BusCustomerCompanyModal from './CustomerCompanyModal';

const BusCustomerLeftListDom: React.FC<{
  onChange: (record) => any;
  actionRef?: React.RefObject<SimpleColumnListRef>;
}> = (props) => {
  const [selectRecord, setSelectRecord] = useState<BusCustomerCompanyType>();
  function onChange(record: any) {
    setSelectRecord(record);
    props.onChange(record);
  }

  return (
    <Card
      style={{ height: '100%', flexDirection: 'column', display: 'flex' }}
      bodyStyle={{ padding: 0, flexGrow: 1, overflow: 'auto' }}
      extra={
        <Space>
          <BusCustomerCompanyModal
            title="新增客户公司"
            node={{ type: 'create' }}
            onFinish={() => {
              props.actionRef?.current?.reload?.();
            }}
          >
            <Button type="link">新增客户公司</Button>
          </BusCustomerCompanyModal>
          <Button type="link" onClick={() => props.actionRef?.current?.reload?.()}>
            刷新
          </Button>
        </Space>
      }
      title={<Space>客户列表</Space>}
    >
      {/*TODO：未完成 <Input
        style={{ width: '100%', padding: 10, border: 'none' }}
        placeholder="输入搜索客户名称"
      /> */}
      <SimpleColumnList
        ref={props.actionRef}
        columns={[
          {
            title: '客户名称',
            dataIndex: 'name',
          },
        ]}
        rowKey="id"
        icon={
          <div style={{ paddingLeft: 10 }}>
            <ShopOutlined style={{ fontSize: 18 }} />
          </div>
        }
        selectKey={selectRecord?.id}
        onChange={(key, record) => {
          onChange(record);
        }}
        request={async (param) => {
          const { data } = await storageDataSource.getValue(STORAGE_CUSTOMER_COMPANY_LIST, true);
          if (data.length > 0) {
            const recordIndex = data.findIndex((i) => i.id === selectRecord?.id);
            if (!selectRecord || recordIndex === -1) {
              onChange(data[0]);
            } else {
              onChange({ ...data[recordIndex] });
            }
          }
          return {
            data,
          };
        }}
      />
    </Card>
  );
};

export default BusCustomerLeftListDom;
